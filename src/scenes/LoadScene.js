import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "load"
    });
  }

  init() {}

  preload() {
    this.load.audio("loop", require("../assets/loop.mp3"));

    this.load.image("background", require("../assets/back.png")); //the back ground image for the scene

    this.load.image("arrows", require("../assets/arrows.png"));
    this.load.image("wasd", require("../assets/wasd.png"));

    this.load.image("covid1", require("../assets/covid1.png"));
    this.load.image("covid2", require("../assets/covid2.png"));

    this.load.image("image", require("../assets/texture.png"));

    this.load.atlas(
      "player",
      require("../assets/player.png"),
      require("../assets/player.json")
    );

    this.load.tilemapTiledJSON("map-0", require("../assets/levels/map-0.json"));
    this.load.tilemapTiledJSON("map-1", require("../assets/levels/map-1.json"));
    this.load.tilemapTiledJSON("map-2", require("../assets/levels/map-2.json"));
    this.load.tilemapTiledJSON("map-3", require("../assets/levels/map-3.json"));
    this.load.tilemapTiledJSON("map-4", require("../assets/levels/map-4.json"));

    var bg = this.add.rectangle(600, 300, 1000, 30, 0x666666);
    var bar = this.add
      .rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff)
      .setScale(0, 1);
    var text = this.add
      .text(600, 200, "Loading...", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    this.load.on("progress", function(progress) {
      bar.setScale(progress, 1);
    });
  }

  create() {
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
      key: "idle",
      frames: [{ key: "player", frame: "p1_stand" }],
      frameRate: 10
    });
    this.scene.start("menu");
  }
}
