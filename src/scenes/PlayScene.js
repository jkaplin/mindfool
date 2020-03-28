import Phaser from "phaser";

var map;
var player;
var cursors;
var laserLayer, winLayer;
var text;
var level;
var backgroundTile;

var leftSpawn, rightSpawn;

let cursorLeft = false;
let cursorRight = false;
let cursorUp = false;
let cursorDown = false;

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

  init() {
    level = 0;
  }

  playerHit() {
    player.setX(leftSpawn.x + 520);
    player.setY(leftSpawn.y + 470);
  }

  playerWin() {
    if (player.x > 800) {
      player.setX(rightSpawn.x + 520);
      player.setY(rightSpawn.y + 470);
      player.setVelocityX(0);
      player.setVelocityY(0);
      console.log("WIN");
    }
  }

  create() {
    backgroundTile = this.add
      .tileSprite(0, 0, 5000, 5000, "background")
      .setOrigin(0.2, 0.2);

    map = this.make.tilemap({ key: "map" });
    var tiles = map.addTilesetImage("tileset", "image");
    laserLayer = map.createStaticLayer("Lasers", tiles, 0, 0);
    winLayer = map.createStaticLayer("Win", tiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // create the player sprite
    leftSpawn = map.findObject("Objects", obj => obj.name === "leftSpawn");
    rightSpawn = map.findObject("Objects", obj => obj.name === "rightSpawn");

    player = this.physics.add.sprite(
      leftSpawn.x + 520,
      leftSpawn.y + 470,
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

    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // this text will show the score
    text = this.add.text(20, 570, "0", {
      fontSize: "20px",
      fill: "#ffffff"
    });
    text.setText("Level: " + level);
    // fix the text to the camera
    text.setScrollFactor(0);

    player.body.setVelocityY(-5);

    /*
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
    */
  }

  handleMouseClick(pointer) {
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

  update(time, delta) {
    console.log(player.x, player.y);
    backgroundTile.x = this.cameras.main.scrollX * -0.1;
    backgroundTile.y = this.cameras.main.scrollY * -0.1;

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
  }
}
