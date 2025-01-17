import Tetromino from "../game-objects/Tetromino.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.GRID_SIZE = 32;
    this.GRID_WIDTH = 10;
    this.GRID_HEIGHT = 20;
    this.score = 0;
    this.scoreText = null;
    this.grid = Array(this.GRID_HEIGHT)
      .fill()
      .map(() => Array(this.GRID_WIDTH).fill(0));
    this.graphics = null;
    this.currentPiece = null;
    this.isPaused = false;
    this.pauseButton = null;
    this.dropTimer = null;
  }

  create() {
    // 初始化图形对象
    this.graphics = this.add.graphics();

    // 添加分数显示
    this.scoreText = this.add.text(10, 10, "Score: 0", {
      fontSize: "20px",
      fill: "#fff",
    });

    // 添加暂停按钮
    this.pauseButton = this.add
      .text(10, 40, "暂停", {
        fontSize: "20px",
        fill: "#fff",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setInteractive();

    // 添加暂停按钮事件
    this.pauseButton.on("pointerdown", () => {
      this.togglePause();
    });

    // 添加暂停按钮悬停效果
    this.pauseButton.on("pointerover", () => {
      this.pauseButton.setStyle({ fill: "#ff0" });
    });

    this.pauseButton.on("pointerout", () => {
      this.pauseButton.setStyle({ fill: "#fff" });
    });

    // 创建第一个方块
    this.currentPiece = new Tetromino(this);

    // 设置游戏循环
    this.dropTimer = this.time.addEvent({
      delay: 1000,
      callback: this.moveDown,
      callbackScope: this,
      loop: true,
    });

    // 设置输入控制
    this.setupInput();
  }

  update() {
    if (this.isPaused) return;

    // 清除之前的渲染
    this.graphics.clear();

    // 绘制已锁定的方块
    this.drawLockedBlocks();

    // 绘制当前方块
    if (this.currentPiece) {
      this.currentPiece.draw();
    }
  }

  setupInput() {
    // 键盘控制
    this.input.keyboard.on("keydown-LEFT", () => {
      if (!this.isPaused) {
        this.currentPiece.moveLeft();
      }
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      if (!this.isPaused) {
        this.currentPiece.moveRight();
      }
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      if (!this.isPaused) {
        this.moveDown();
      }
    });

    this.input.keyboard.on("keydown-UP", () => {
      if (!this.isPaused) {
        this.currentPiece.rotate();
      }
    });

    // 触摸控制
    let touchStartX = 0;
    let touchStartY = 0;

    this.input.on("pointerdown", (pointer) => {
      touchStartX = pointer.x;
      touchStartY = pointer.y;
    });

    this.input.on("pointerup", (pointer) => {
      if (this.isPaused) return;

      const diffX = pointer.x - touchStartX;
      const diffY = pointer.y - touchStartY;
      const swipeThreshold = 30;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > swipeThreshold) {
          this.currentPiece.moveRight();
        } else if (diffX < -swipeThreshold) {
          this.currentPiece.moveLeft();
        }
      } else {
        if (diffY > swipeThreshold) {
          this.moveDown();
        } else if (diffY < -swipeThreshold) {
          this.currentPiece.rotate();
        }
      }
    });
  }

  moveDown() {
    if (this.isPaused) return;

    if (!this.currentPiece.moveDown()) {
      // 如果不能继续下落，固定当前方块并生成新的
      this.currentPiece.lock();
      this.checkLines();
      this.currentPiece = new Tetromino(this);
      this.checkGameOver();
    }
  }

  checkLines() {
    let linesCleared = 0;
    for (let y = this.GRID_HEIGHT - 1; y >= 0; y--) {
      if (this.grid[y].every((cell) => cell === 1)) {
        linesCleared++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.GRID_WIDTH).fill(0));
      }
    }

    if (linesCleared > 0) {
      this.score += linesCleared * 100;
      this.scoreText.setText(`Score: ${this.score}`);

      const highScore = localStorage.getItem("tetrisHighScore") || 0;
      if (this.score > highScore) {
        localStorage.setItem("tetrisHighScore", this.score);
      }
    }
  }

  checkGameOver() {
    if (!this.currentPiece.canMove(this.currentPiece.x, this.currentPiece.y)) {
      this.scene.start("MenuScene");
    }
  }

  drawLockedBlocks() {
    this.graphics.fillStyle(0x808080);
    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        if (this.grid[y][x]) {
          this.graphics.fillRect(
            x * this.GRID_SIZE,
            y * this.GRID_SIZE,
            this.GRID_SIZE - 1,
            this.GRID_SIZE - 1
          );
        }
      }
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // 暂停游戏
      this.pauseButton.setText("继续");
      if (this.dropTimer) {
        this.dropTimer.paused = true;
      }
    } else {
      // 继续游戏
      this.pauseButton.setText("暂停");
      if (this.dropTimer) {
        this.dropTimer.paused = false;
      }
    }
  }
}
