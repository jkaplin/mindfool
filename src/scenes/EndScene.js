import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "end"
    });
  }

  create() {
    this.add.image(600, 300, "background");

    this.add
      .text(600, 50, "WELL DONE\nyou avoided the virus, mindfool", {
        align: "center",
        fill: "lightgreen",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    this.add
      .text(600, 600, "Developed by Joseph Kaplin and Vincent Dauvergne", {
        align: "center",
        fill: "blue",
        fontFamily: "sans-serif",
        fontSize: 25
      })
      .setOrigin(0.5, 0);

    let menu = this.add
      .text(600, 300, "RELOAD", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    menu.setInteractive();

    menu.on("pointerover", () => {
      menu.setColor("teal");
    });
    menu.on("pointerout", () => {
      menu.setColor("white");
    });
    menu.on("pointerdown", () => {
      window.location.reload();
    });
  }
}
