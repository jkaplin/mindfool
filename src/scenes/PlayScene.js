import Phaser from "phaser";

var fixX = 0;
var fixY = -50;

var mode;
var score;

var size;
var map;
var player, player2;
var cursors;
var laserLayer, winLayer;
var text;
var level;
var backgroundTile;
var timedEvent;
var timerBox;
var timerBar;
let timerBarWidth;
let restartTime;

var leftSpawn, rightSpawn;
var mySpawn, otherSpawn;

var cursorLeft, cursorRight, cursorUp, cursorDown;

var devMode;

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
    score = data.score;
    devMode = data.devMode;

    restartTime = false;
    timerBarWidth = 500;
    cursorLeft = false;
    cursorRight = false;
    cursorUp = false;
    cursorDown = false;

    player = data.p1;
    player2 = data.p2;
    player.refresh();
    player2.refresh();
  }

  playerHit() {
    player.died();
    player.respawn();
    restartTime = true;
    if (player2.won || mode === "multiplayer") {
      player2.won = false;
      player2.respawn();
    }
  }

  playerHit2() {
    player2.died();
    player2.respawn();
    restartTime = true;
    if (player.won || mode === "multiplayer") {
      player.won = false;
      player.respawn();
    }
  }

  playersHit() {
    player.died();
    player2.died();
    player.won = false;
    player2.won = false;
    player.respawn();
    player2.respawn();
    restartTime = true;
  }

  playerWin() {
    if (
      (mode === "singleplayer" && player.physics.x > 800) ||
      (mode === "multiplayer" && player.physics.x < 800)
    ) {
      player.respawn(otherSpawn.x + fixX, otherSpawn.y + fixY);
      cursorLeft = false;
      cursorRight = false;
      cursorUp = false;
      cursorDown = false;
      player.hasWon();
    }
  }

  playerWin2() {
    if (player2.physics.x > 800) {
      player2.respawn(mySpawn.x + fixX, mySpawn.y + fixY);
      cursorLeft = false;
      cursorRight = false;
      cursorUp = false;
      cursorDown = false;
      player2.hasWon();
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

    player.x = mySpawn.x + fixX;
    player.y = mySpawn.y + fixY;
    player.setPhysics(
      this.physics.add.sprite(player.x, player.y, player.imgURL)
    );
    player.physics.anims.play("idle", true);

    laserLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(player.physics, laserLayer, this.playerHit);

    winLayer.setCollisionByProperty({ win: true });
    this.physics.add.collider(player.physics, winLayer, this.playerWin);

    // small fix to our player images, we resize the physics body object slightly
    player.physics.body.setSize(
      player.physics.width,
      player.physics.height - 8
    );

    if (mode === "multiplayer") {
      player2.x = otherSpawn.x + fixX;
      player2.y = otherSpawn.y + fixY;
      player2.setPhysics(
        this.physics.add.sprite(player2.x, player2.y, player2.imgURL)
      );
      player2.physics.anims.play("idle2", true);

      this.physics.add.collider(player2.physics, laserLayer, this.playerHit2);
      this.physics.add.collider(player2.physics, winLayer, this.playerWin2);

      // small fix to our player images, we resize the physics body object slightly
      player2.physics.body.setSize(
        player2.physics.width,
        player2.physics.height - 8
      );

      this.physics.add.collider(
        player.physics,
        player2.physics,
        this.playersHit
      );
      player.physics.flipX = true; // flip the sprite to the left
      player2.physics.body.setVelocityY(-5);
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
    this.cameras.main.startFollow(player.physics);

    if (mode === "singleplayer") {
      text = this.add.text(1000, 20, "", {
        fontSize: "25px",
        fill: "#ffffff"
      });
    }
    if (mode === "multiplayer") {
      this.cameras.main.setZoom(0.7);
      text = this.add.text(1180, -100, "", {
        fontSize: "30px",
        fill: "#ffffff"
      });
    }
    // fix the text to the camera
    text.setScrollFactor(0);
    text.setText("Level: " + level + " / 4");

    player.physics.body.setVelocityY(-5);

    timedEvent = this.time.addEvent({
      delay: 10000 + level * 5000,
      callback: this.handleTimeEvent,
      callbackScope: this,
      loop: true
    });

    timerBox = this.add.rectangle(25, 25, 510, 40, 0x333333).setOrigin(0);
    timerBar = this.add
      .rectangle(30, 30, timerBarWidth, 30, 0xffffff)
      .setOrigin(0);

    if (devMode) {
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
  }

  handleTimeEvent() {
    if (mode === "singleplayer") {
      this.playerHit();
    } else {
      this.playersHit();
    }
  }

  handleMouseClick(pointer) {
    /*
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
    */
  }

  update(time, delta) {
    if (player.won || player2.won) {
      if (mode === "singleplayer" || (player.won && player2.won)) {
        player.addTime(timedEvent.getProgress());
        if (mode === "multiplayer")
          player2.addTime(timedEvent.getProgress());
        this.scene.start("score", {
          mode: mode,
          level: level + 1,
          time: timedEvent.getProgress(),
          score: score,
          p1: player,
          p2: player2
        });
      }
    }
    backgroundTile.x = this.cameras.main.scrollX * -0.05;
    backgroundTile.y = this.cameras.main.scrollY * -0.05;

    this.input.on("pointerdown", this.handleMouseClick);
    if (cursorLeft || cursors.left.isDown) {
      player.moveLeft();
    }
    if (cursorRight || cursors.right.isDown) {
      player.moveRight();
    }
    if (cursorUp || cursors.up.isDown) {
      player.moveUp();
    }
    if (cursorDown || cursors.down.isDown) {
      player.moveDown();
    }
    if (player.won) {
      player.stopMove();
    }

    if (mode === "multiplayer") {
      if (cursorLeft || cursors.a.isDown) {
        player2.moveLeft();
      }
      if (cursorRight || cursors.d.isDown) {
        player2.moveRight();
      }
      if (cursorUp || cursors.w.isDown) {
        player2.moveUp();
      }
      if (cursorDown || cursors.s.isDown) {
        player2.moveDown();
      }
      if (player2.won) {
        player2.stopMove();
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

    size = timerBarWidth * (1 - timedEvent.getProgress());
    timerBar.setSize(size, 30);
    if (timedEvent.getProgress() > 0.7) {
      timerBar.setFillStyle(0xff0000);
    } else {
      timerBar.setFillStyle(0xffffff);
    }
    if (mode === "singleplayer") {
      timerBox.setScrollFactor(0);
      timerBar.setScrollFactor(0);
    }
    if (restartTime) {
      player.addTime(timedEvent.getProgress());
        if (mode === "multiplayer")
          player2.addTime(timedEvent.getProgress());
      timedEvent.remove();
      timedEvent = this.time.addEvent({
        delay: 10000 + level * 5000,
        callback: this.handleTimeEvent,
        callbackScope: this,
        loop: true
      });
      restartTime = false;
    }
  }
}
