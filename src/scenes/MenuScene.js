import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "menu"
    });
  }

  create() {
    this.add.image(600, 300, "background");

    this.add.arc(600, 200, 50, 0, 180, 0xff0000, 0x00ffff);

    this.add
      .text(600, 200, "MINDFOOL", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    // sound
    var music = this.sound.add("loop");
    music.play({ volume: 0.1, loop: true });

    let singleplayer = this.add
      .text(300, 300, "SINGLEPLAYER", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    let multiplayer = this.add
      .text(900, 300, "MULTIPLAYER", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    singleplayer.setInteractive();
    multiplayer.setInteractive();

    singleplayer.on("pointerover", () => {
      singleplayer.setColor("teal");
    });
    singleplayer.on("pointerout", () => {
      singleplayer.setColor("white");
    });
    singleplayer.on("pointerdown", () => {
      this.scene.start("play", { mode: "singleplayer", level: 0 });
    });
    multiplayer.on("pointerover", () => {
      multiplayer.setColor("aqua");
    });
    multiplayer.on("pointerout", () => {
      multiplayer.setColor("white");
    });
    multiplayer.on("pointerdown", () => {
      this.scene.start("play", { mode: "multiplayer", level: 0 });
    });
  }
}