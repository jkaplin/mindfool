import Phaser from "phaser";
import io from "socket.io-client";

var fixX = 0;
var fixY = -50;

var mode;

var map;
var player, player2;
var cursors;
var laserLayer, winLayer;
var text;
var level;
var backgroundTile;

var leftSpawn, rightSpawn;
var mySpawn, otherSpawn;

var cursorLeft, cursorRight, cursorUp, cursorDown;

var win, win2;

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 0
          },
          debug: false
        }
      }
    });
  }

  init(data) {
    level = data.level;
    mode = data.mode;

    cursorLeft = false;
    cursorRight = false;
    cursorUp = false;
    cursorDown = false;

    win = false;
    win2 = false;
  }

  playerHit() {
    player.setX(mySpawn.x + fixX);
    player.setY(mySpawn.y + fixY);
  }

  playerHit2() {
    player2.setX(otherSpawn.x + fixX);
    player2.setY(otherSpawn.y + fixY);
  }

  playersHit() {
    win = false;
    win2 = false;
    player.setX(mySpawn.x + fixX);
    player.setY(mySpawn.y + fixY);
    player2.setX(otherSpawn.x + fixX);
    player2.setY(otherSpawn.y + fixY);
  }

  playerWin() {
    if (
      (mode === "singleplayer" && player.x > 800) ||
      (mode === "multiplayer" && player.x < 800)
    ) {
      player.setX(otherSpawn.x + fixX);
      player.setY(otherSpawn.y + fixY);
      player.setVelocityX(0);
      player.setVelocityY(0);
      cursorLeft = false;
      cursorRight = false;
      cursorUp = false;
      cursorDown = false;
      win = true;
    }
  }

  playerWin2() {
    if (player2.x > 800) {
      player2.setX(mySpawn.x + fixX);
      player2.setY(mySpawn.y + fixY);
      player2.setVelocityX(0);
      player2.setVelocityY(0);
      cursorLeft = false;
      cursorRight = false;
      cursorUp = false;
      cursorDown = false;
      win2 = true;
    }
  }

  preload() {
    console.log(level);
    switch (level) {
      case 0:
        this.load.tilemapTiledJSON(
          "map-0",
          require("../assets/levels/map-0.json")
        );
        break;
      case 1:
        this.load.tilemapTiledJSON(
          "map-1",
          require("../assets/levels/map-1.json")
        );
        break;
      case 2:
        this.load.tilemapTiledJSON(
          "map-2",
          require("../assets/levels/map-2.json")
        );
        break;
      /*
      case 3:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-3.json"));
        break;
      case 4:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-4.json"));
        break;
      case 5:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-5.json"));
        break;
      case 6:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-6.json"));
        break;
      case 7:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-7.json"));
        break;
      case 8:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-8.json"));
        break;
      case 9:
        this.load.tilemapTiledJSON("map", require("../assets/levels/map-9.json"));
        break;
        */
      default:
        break;
    }
  }

  create() {
    const currentMap = { key: "map-" + level };
    map = this.make.tilemap(currentMap);

    leftSpawn = map.findObject("Objects", obj => obj.name === "leftSpawn");
    rightSpawn = map.findObject("Objects", obj => obj.name === "rightSpawn");

    if (mode === "singleplayer") {
      mySpawn = leftSpawn;
      otherSpawn = rightSpawn;
    } else if (mode === "multiplayer") {
      mySpawn = rightSpawn;
      otherSpawn = leftSpawn;
    }

    backgroundTile = this.add
      .tileSprite(0, 0, 5000, 5000, "background")
      .setOrigin(0.2, 0.2);

    var tiles = map.addTilesetImage("tileset", "image");
    laserLayer = map.createStaticLayer("Lasers", tiles, 0, 0);
    winLayer = map.createStaticLayer("Win", tiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    player = this.physics.add.sprite(
      mySpawn.x + fixX,
      mySpawn.y + fixY,
      "player"
    );

    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map

    laserLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(player, laserLayer, this.playerHit);

    winLayer.setCollisionByProperty({ win: true });
    this.physics.add.collider(player, winLayer, this.playerWin);

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height - 8);

    if (mode === "multiplayer") {
      player2 = this.physics.add.sprite(
        otherSpawn.x + fixX,
        otherSpawn.y + fixY,
        "player"
      );

      player2.setBounce(0.2); // our player will bounce from items
      player2.setCollideWorldBounds(true); // don't go out of the map

      laserLayer.setCollisionByProperty({ collides: true });
      this.physics.add.collider(player2, laserLayer, this.playerHit2);

      winLayer.setCollisionByProperty({ win: true });
      this.physics.add.collider(player2, winLayer, this.playerWin2);

      // small fix to our player images, we resize the physics body object slightly
      player2.body.setSize(player2.width, player2.height - 8);

      this.physics.add.collider(player, player2, this.playersHit);
      player.flipX = true; // flip the sprite to the left
      player2.body.setVelocityY(-5);
    }

    cursors = this.input.keyboard.createCursorKeys();
    cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D
    });

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(0.7);

    // this text will show the score
    text = this.add.text(1180, -100, "", {
      fontSize: "20px",
      fill: "#ffffff"
    });
    text.setText("Level: " + level + " / 9");
    // fix the text to the camera
    text.setScrollFactor(0);
    text.setScale(1.5);

    player.body.setVelocityY(-5);

    // DEBUG
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    laserLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    winLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(200, 100, 100, 200), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(100, 59, 100, 255) // Color of colliding face edges
    });
  }

  handleMouseClick(pointer) {
    if (mode === "singleplayer") {
      var touchX = pointer.x;
      var touchY = pointer.y;
      if (touchX < 600) {
        cursorLeft = true;
        cursorRight = false;
      } else {
        cursorLeft = false;
        cursorRight = true;
      }
      if (touchY < 300) {
        cursorUp = true;
        cursorDown = false;
      } else {
        cursorUp = false;
        cursorDown = true;
      }
    }
  }

  update(time, delta) {
    if (win || win2) {
      if (mode === "singleplayer" || (win && win2)) {
        this.scene.start("play", { mode: mode, level: level + 1 });
      }
    }
    backgroundTile.x = this.cameras.main.scrollX * -0.05;
    backgroundTile.y = this.cameras.main.scrollY * -0.05;

    this.input.on("pointerdown", this.handleMouseClick);
    if (cursorLeft || cursors.left.isDown) {
      if (player.body.velocity.x > -200) {
        player.body.setVelocityX(player.body.velocity.x - 10);
      }
      player.anims.play("walk", true); // walk left
      player.flipX = true; // flip the sprite to the left
    }
    if (cursorRight || cursors.right.isDown) {
      if (player.body.velocity.x < 200) {
        player.body.setVelocityX(player.body.velocity.x + 10);
      }
      player.anims.play("walk", true);
      player.flipX = false; // use the original sprite looking to the right
    }
    if (cursorUp || cursors.up.isDown) {
      if (player.body.velocity.y > -200) {
        player.body.setVelocityY(player.body.velocity.y - 10);
      }
    }
    if (cursorDown || cursors.down.isDown) {
      if (player.body.velocity.y < 200) {
        player.body.setVelocityY(player.body.velocity.y + 10);
      }
    }
    if (!cursors.left.isDown || !cursors.right.isDown) {
      player.body.setVelocityX(player.body.velocity.x);
      player.anims.play("idle", true);
    }
    if (!cursors.up.isDown || !cursors.down.isDown) {
      player.body.setVelocityY(player.body.velocity.y);
      player.anims.play("idle", true);
    }
    if (win) {
      player.body.setVelocityX(0);
      player.body.setVelocityY(0);
    }

    if (mode === "multiplayer") {
      if (cursorLeft || cursors.a.isDown) {
        if (player2.body.velocity.x > -200) {
          player2.body.setVelocityX(player2.body.velocity.x - 10);
        }
        player2.anims.play("walk", true); // walk left
        player2.flipX = true; // flip the sprite to the left
      }
      if (cursorRight || cursors.d.isDown) {
        if (player2.body.velocity.x < 200) {
          player2.body.setVelocityX(player2.body.velocity.x + 10);
        }
        player2.anims.play("walk", true);
        player2.flipX = false; // use the original sprite looking to the right
      }
      if (cursorUp || cursors.w.isDown) {
        if (player2.body.velocity.y > -200) {
          player2.body.setVelocityY(player2.body.velocity.y - 10);
        }
      }
      if (cursorDown || cursors.s.isDown) {
        if (player2.body.velocity.y < 200) {
          player2.body.setVelocityY(player2.body.velocity.y + 10);
        }
      }
      if (!cursors.a.isDown || !cursors.d.isDown) {
        player2.body.setVelocityX(player2.body.velocity.x);
        player2.anims.play("idle", true);
      }
      if (!cursors.w.isDown || !cursors.s.isDown) {
        player2.body.setVelocityY(player2.body.velocity.y);
        player2.anims.play("idle", true);
      }
      if (win2) {
        player2.body.setVelocityX(0);
        player2.body.setVelocityY(0);
      }
    }
    // switching from mouse to keyboard controls:
    if (
      cursors.left.isDown ||
      cursors.right.isDown ||
      cursors.up.isDown ||
      cursors.down.isDown
    ) {
      cursorLeft = false;
      cursorRight = false;
      cursorUp = false;
      cursorDown = false;
    }
  }
}
