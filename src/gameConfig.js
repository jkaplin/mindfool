import Phaser from "phaser";
import LoadScene from "./scenes/LoadScene";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";
import EndScene from "./scenes/EndScene";
import ScoreScene from "./scenes/ScoreScene";

export default {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  pixelArt: true,
  title: "MindFool",
  url: "https://github.com/jkaplin/mindfool",
  banner: {
    text: "white",
    background: ["#FD7400", "#FFE11A", "#BEDB39", "#1F8A70", "#004358"]
  },
  scene: [LoadScene, MenuScene, PlayScene, EndScene, ScoreScene]
};
