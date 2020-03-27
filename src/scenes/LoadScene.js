import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "load"
    });
  }

  init() {}

  preload() {
    var bg = this.add.rectangle(600, 300, 400, 30, 0x666666);
    var bar = this.add
      .rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff)
      .setScale(0, 1);

    this.load.audio("loop", require("../assets/loop.mp3"));

    this.load.image("background", require("../assets/back.png")); //the back ground image for the scene

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON("map", require("../assets/map.json"));
    this.load.image("image", require("../assets/texture.png"));
    // tiles in spritesheet
    this.load.spritesheet("tiles", require("../assets/tiles.png"), {
      frameWidth: 70,
      frameHeight: 70
    });
    // player animations
    this.load.atlas(
      "player",
      require("../assets/player.png"),
      require("../assets/player.json")
    );

    this.load.on("progress", function(progress) {
      bar.setScale(progress, 1);
    });
  }

  create() {
    // player walk animation
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNames("player", {
        prefix: "p1_walk",
        start: 1,
        end: 11,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
      key: "idle",
      frames: [{ key: "player", frame: "p1_stand" }],
      frameRate: 10
    });
    this.scene.start("menu");
  }
}
