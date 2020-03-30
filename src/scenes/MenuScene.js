import Phaser from "phaser";
import { Character } from "./character";

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "menu"
    });
  }

  create() {
    this.add.image(600, 300, "background");

    this.add.image(900, 500, "arrows");
    this.add.image(300, 500, "wasd");

    this.add.image(900, 150, "covid1");
    this.add.image(300, 150, "covid2");

    this.add.text(880, 140, "COVID-19", {
      fill: "red",
      fontSize: 10
    });

    this.add.text(280, 140, "COVID-19", {
      fill: "red",
      fontSize: 10
    });

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
      .text(900, 300, "SINGLEPLAYER", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    let multiplayer = this.add
      .text(300, 300, "MULTIPLAYER", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setOrigin(0.5, 0);

    let devMode = this.add
      .text(600, 400, "Dev Mode", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 28
      })
      .setOrigin(0.5, 0);

    let devModeBool = false;

    singleplayer.setInteractive();
    multiplayer.setInteractive();
    devMode.setInteractive();

    singleplayer.on("pointerover", () => {
      singleplayer.setScale(1.1);
    });
    singleplayer.on("pointerout", () => {
      singleplayer.setScale(1 / 1.1);
    });
    singleplayer.on("pointerdown", () => {
      this.scene.start("play", {
        mode: "singleplayer",
        level: 0,
        score: 0,
<<<<<<< HEAD
        p1: new Character("Player", "player"),
        p2: new Character(null, null)
=======
        p1: new Character("player", "player"),
        p2: new Character("empty", null),
        devMode: devModeBool
>>>>>>> 45fea59811672053eeef4caf608197adc0219cbe
      });
    });
    multiplayer.on("pointerover", () => {
      multiplayer.setScale(1.1);
    });
    multiplayer.on("pointerout", () => {
      multiplayer.setScale(1 / 1.1);
    });
    multiplayer.on("pointerdown", () => {
      this.scene.start("play", {
        mode: "multiplayer",
        level: 0,
        score: 0,
<<<<<<< HEAD
        p1: new Character("Player1", "player"),
        p2: new Character("Player2", "player2")
=======
        p1: new Character("p1", "player"),
        p2: new Character("p2", "player2"),
        devMode: devModeBool
>>>>>>> 45fea59811672053eeef4caf608197adc0219cbe
      });
    });
    devMode.on("pointerover", () => {
      devMode.setScale(1.1);
    });
    devMode.on("pointerout", () => {
      devMode.setScale(1 / 1.1);
    });
    devMode.on("pointerdown", () => {
      devModeBool = !devModeBool;
      if (devModeBool) {
        devMode.setColor("green");
      } else {
        devMode.setColor("white");
      }
    });
  }
}
