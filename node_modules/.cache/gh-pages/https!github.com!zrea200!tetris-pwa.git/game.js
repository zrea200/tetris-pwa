import GameScene from "./scenes/GameScene.js";
import MenuScene from "./scenes/MenuScene.js";

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 640,
  backgroundColor: "#000000",
  scene: [MenuScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

new Phaser.Game(config);
