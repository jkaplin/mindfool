import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "menu"
    });
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0);
    this.add.image(200, 200, "player").setScale(1);
    this.add.arc(600, 200, 50, 0, 180, 0xff0000, 0x00ffff);
    this.add
      .text(600, 200, "MINDFOOL", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);
    this.input.on(
      "pointerdown",
      function() {
        this.scene.switch("play");
      },
      this
    );

    // sound
    var music = this.sound.add("loop");
    music.play({ volume: 0.1, loop: true });
  }
}
