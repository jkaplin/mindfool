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

    init(data)
    {
        mode = data.mode;
        level = data.level;
        score = (1 - data.time) * 100;
        totalScore = data.score + score;
        p1 = data.p1;
        p2 = data.p2;
        p1.won = false;
        p2.won = false;
    }

    create() {
        let scoreText = this.add.text(450, 200, "Score: " + Math.round(score), {
            align: "center",
            fill: "white",
            fontFamily: "sans-serif",
            fontSize: 48
        })

        let totalScoreText = this.add.text(400, 300, "total Score: " + Math.round(totalScore), {
            align: "center",
            fill: "white",
            fontFamily: "sans-serif",
            fontSize: 48
        })

        let next = this.add.text(500, 500, "NEXT", {
            align: "center",
            fill: "white",
            fontFamily: "sans-serif",
            fontSize: 48
        }).setInteractive();

        next.on("pointerover", () => {
            next.setColor("aqua");
        });
        next.on("pointerout", () => {
            next.setColor("white");
        });
        next.on("pointerdown", () => {
            if (level < 4)
                this.scene.start("play", { mode: mode, level: level, score: totalScore, p1: p1, p2: p2 });
            else
                this.scene.start("end");
        });
    }
}