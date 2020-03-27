import Phaser from "phaser";

var map;
var player;
var cursors;
var groundLayer, coinLayer, laserLayer;
var text;
var score;

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
    score = 0;
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0);
    // load the map
    map = this.make.tilemap({ key: "map" });

    // tiles for the laser layer
    var laserTiles = map.addTilesetImage("texture", "image");
    // create the laser layer
    laserLayer = map.createDynamicLayer("Tile Layer 1", laserTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // create the player sprite
    player = this.physics.add.sprite(200, 200, "player");
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height - 8);

    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // this text will show the score
    text = this.add.text(20, 570, "0", {
      fontSize: "20px",
      fill: "#ffffff"
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    this.physics.add.collider(player, laserLayer);

    player.body.setVelocityY(-5);
  }

  update(time, delta) {
    if (cursors.left.isDown) {
      if (player.body.velocity.x > -200) {
        player.body.setVelocityX(player.body.velocity.x - 10);
      }
      player.anims.play("walk", true); // walk left
      player.flipX = true; // flip the sprite to the left
    }
    if (cursors.right.isDown) {
      if (player.body.velocity.x < 200) {
        player.body.setVelocityX(player.body.velocity.x + 10);
      }
      player.anims.play("walk", true);
      player.flipX = false; // use the original sprite looking to the right
    }
    if (cursors.up.isDown) {
      if (player.body.velocity.y > -200) {
        player.body.setVelocityY(player.body.velocity.y - 10);
      }
    }
    if (cursors.down.isDown) {
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
