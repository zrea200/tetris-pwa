export default class Tetromino {
  constructor(scene) {
    this.scene = scene;
    this.shapes = [
      [[1, 1, 1, 1]], // I
      [
        [1, 1],
        [1, 1],
      ], // O
      [
        [1, 1, 1],
        [0, 1, 0],
      ], // T
      [
        [1, 1, 1],
        [1, 0, 0],
      ], // L
      [
        [1, 1, 1],
        [0, 0, 1],
      ], // J
      [
        [1, 1, 0],
        [0, 1, 1],
      ], // S
      [
        [0, 1, 1],
        [1, 1, 0],
      ], // Z
    ];

    this.currentShape = [
      ...this.shapes[Math.floor(Math.random() * this.shapes.length)],
    ];
    this.x = Math.floor((scene.GRID_WIDTH - this.currentShape[0].length) / 2);
    this.y = 0;
  }

  draw() {
    this.scene.graphics.fillStyle(0xff0000);
    for (let y = 0; y < this.currentShape.length; y++) {
      for (let x = 0; x < this.currentShape[y].length; x++) {
        if (this.currentShape[y][x]) {
          this.scene.graphics.fillRect(
            (this.x + x) * this.scene.GRID_SIZE,
            (this.y + y) * this.scene.GRID_SIZE,
            this.scene.GRID_SIZE - 1,
            this.scene.GRID_SIZE - 1
          );
        }
      }
    }
  }

  moveLeft() {
    if (this.canMove(this.x - 1, this.y)) {
      this.x--;
      this.draw();
    }
  }

  moveRight() {
    if (this.canMove(this.x + 1, this.y)) {
      this.x++;
      this.draw();
    }
  }

  moveDown() {
    if (this.canMove(this.x, this.y + 1)) {
      this.y++;
      this.draw();
      return true;
    }
    return false;
  }

  rotate() {
    const rotated = this.currentShape[0].map((_, i) =>
      this.currentShape.map((row) => row[i]).reverse()
    );

    if (this.canMove(this.x, this.y, rotated)) {
      this.currentShape = rotated;
      this.draw();
    }
  }

  canMove(newX, newY, shape = this.currentShape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const nextX = newX + x;
          const nextY = newY + y;

          if (
            nextX < 0 ||
            nextX >= this.scene.GRID_WIDTH ||
            nextY >= this.scene.GRID_HEIGHT ||
            (nextY >= 0 && this.scene.grid[nextY][nextX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  lock() {
    for (let y = 0; y < this.currentShape.length; y++) {
      for (let x = 0; x < this.currentShape[y].length; x++) {
        if (this.currentShape[y][x]) {
          this.scene.grid[this.y + y][this.x + x] = 1;
        }
      }
    }
  }
}
