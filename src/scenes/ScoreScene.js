import Phaser from "phaser";

var mode;
var level;
var score;
var totalScore;
var p1;
var p2;

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: "score"
    });
  }

  init(data) {
    mode = data.mode;
    level = data.level;
    p1 = data.p1;
    p2 = data.p2;
    p1.won = false;
    p2.won = false;
    p1.calcScore(level);
    p2.calcScore(level);
    if (mode === "singleplayer")
        totalScore = data.score + p1.score;
    else
        totalScore = data.score + p1.score + p2.score;
  }

  create() {
    let p1ScoreText = this.add.text((mode === "multiplayer") ? 200 : 450, 150, p1.name + " Score: " + Math.round(p1.score), {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 32
    });

    if (mode === "multiplayer") {
        let p2ScoreText = this.add.text(800, 150, p2.name + " Score: " + Math.round(p2.score), {
            align: "center",
            fill: "white",
            fontFamily: "sans-serif",
            fontSize: 32
        });
    }

    let totalScoreText = this.add.text(450, 350, "Total Score: " + Math.round(totalScore),
      {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 32
      }
    );

    let next = this.add
      .text(500, 500, "NEXT", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48
      })
      .setInteractive();

    next.on("pointerover", () => {
      next.setColor("aqua");
    });
    next.on("pointerout", () => {
      next.setColor("white");
    });
    next.on("pointerdown", () => {
      if (level < 5)
        this.scene.start("play", {
          mode: mode,
          level: level,
          score: totalScore,
          p1: p1,
          p2: p2
        });
      else this.scene.start("end");
    });
  }
}
