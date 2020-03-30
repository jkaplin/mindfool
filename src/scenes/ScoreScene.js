import Phaser from "phaser";

var mode;
var level;
var score;
var totalScore;

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
                this.scene.start("play", { mode: mode, level: level, score: totalScore });
            else
                this.scene.start("end");
        });
    }
}