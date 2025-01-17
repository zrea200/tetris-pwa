export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const { width, height } = this.scale;

    // 添加标题
    this.add
      .text(width / 2, height / 3, "俄罗斯方块", {
        fontSize: "48px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // 添加开始按钮
    const startButton = this.add
      .text(width / 2, height / 2, "开始游戏", {
        fontSize: "32px",
        fill: "#fff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#444",
      })
      .setOrigin(0.5)
      .setInteractive();

    // 添加最高分显示
    const highScore = localStorage.getItem("tetrisHighScore") || 0;
    this.add
      .text(width / 2, height * 0.7, `最高分: ${highScore}`, {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // 点击开始按钮时切换到游戏场景
    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // 添加悬停效果
    startButton.on("pointerover", () => {
      startButton.setStyle({ fill: "#ff0" });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ fill: "#fff" });
    });
  }
}
