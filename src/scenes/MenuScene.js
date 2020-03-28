import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "menu"
    });
  }

  create() {
    this.add.image(600, 300, "background");

    this.add.arc(600, 300, 50, 0, 180, 0xff0000, 0x00ffff);

    this.add
      .text(600, 300, "MINDFOOL", {
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
