import { Coords } from "./coords.model";
import { Board } from "./board.model";

export class GameOfLife {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private board: Board;
  private cellDimension: number;
  private directionOffsets: Coords[];

  constructor(public canvasId: string = "board") {
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.ctx.strokeStyle = '#e1e1e1';
    this.ctx.fillStyle = 'cadetblue';
    this.cellDimension = 10;
    this.board = this.initBoard();
    this.directionOffsets = GameOfLife.getSquaredNeighbors();
  }

  public start() {
    this.seedBoard();
    this.nextFrame();
  }

  private initBoard(): Board {
    const cols = this.canvas.width / this.cellDimension;
    const rows = this.canvas.height / this.cellDimension;
    return new Board(cols, rows);
  }

  private seedBoard() {
    const spaceFiller: String[] = [
      "0000000000000000000011100011100000000000000000000",
      "0000000000000000000100100010010000000000000000000",
      "1111000000000000000000100010000000000000000001111",
      "1000100000000000000000100010000000000000000010001",
      "1000000001000000000000100010000000000001000000001",
      "0100100110010000000000000000000000000100110010010",
      "0000001000001000000011100011100000001000001000000",
      "0000001000001000000001000001000000001000001000000",
      "0000001000001000000001111111000000001000001000000",
      "0100100110010011000010000000100001100100110010010",
      "1000000001000110000111111111110000110001000000001",
      "1000100000000011000000000000000001100000000010001",
      "1111000000000001111111111111111111000000000001111",
      "0000000000000000101000000000001010000000000000000",
      "0000000000000000000111111111110000000000000000000",
      "0000000000000000000100000000010000000000000000000",
      "0000000000000000000011111111100000000000000000000",
      "0000000000000000000000001000000000000000000000000",
      "0000000000000000000011100011100000000000000000000",
      "0000000000000000000000100010000000000000000000000",
      "0000000000000000000000000000000000000000000000000",
      "0000000000000000000001110111000000000000000000000",
      "0000000000000000000001110111000000000000000000000",
      "0000000000000000000010110110100000000000000000000",
      "0000000000000000000011100011100000000000000000000",
      "0000000000000000000001000001000000000000000000000"
    ];

    const fillerRows = spaceFiller.length;
    const fillerColumns = spaceFiller[0].length;
    const startingX = Math.floor((this.board.rows / 2) - (fillerColumns / 2));
    const startingY = Math.floor((this.board.columns / 2) - (fillerRows / 2));

    for (let row = 0; row < fillerRows; row++) {
      for (let column = 0; column < fillerColumns; column++) {
        this.board.setStateAt(startingX + column, startingY + row, spaceFiller[row][column] == "1");
      }
    }
  }

  private nextFrame() {
    this.render();
    this.update();
    setTimeout(() => {
      this.nextFrame();
    }, 70);
    // requestAnimationFrame(this.nextFrame.bind(this)); // Too fast!
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let y = 0; y < this.board.columns; y++) {
      for (let x = 0; x < this.board.rows; x++) {
        this.ctx.beginPath();
        this.ctx.rect(x * this.cellDimension, y * this.cellDimension, this.cellDimension, this.cellDimension);
        if (this.board.getStateAt(x, y)) this.ctx.fill();
        else this.ctx.stroke();
      }
    }
  }

  private update() {
    const nextBoard: Board = this.initBoard();

    for (let y = 0; y < this.board.columns; y++) {
      for (let x = 0; x < this.board.rows; x++) {
        nextBoard.setStateAt(x, y, this.getCellFate(x, y));
      }
    }

    this.board = nextBoard;
  }

  private getCellFate(x: number, y: number): boolean {
    const aliveNeighborsCount = this.getCountOfAliveNeighbors(x, y);
    const cellCurrentState: boolean = this.board.getStateAt(x, y);

    // state "true" => "alive", state "false" => "dead"
    let cellFate: boolean = false;

    // a live cell with two or three live neighbors lives on to the next generation
    if (cellCurrentState === true && (aliveNeighborsCount == 2 || aliveNeighborsCount == 3)) {
      cellFate = true;
    }
    // a dead cell with exactly three live neighbors becomes a live cell, as if by reproduction
    else if (cellCurrentState === false && aliveNeighborsCount == 3) {
      cellFate = true;
    }
    // otherwise it means that the cell have fewer than two live neighbors (under population) or
    // more than three live neighbors (overpopulation) and dies.

    return cellFate;
  }

  /**
   * Count the number of living neighbors
   * @param x Starting x point
   * @param y Starting y point
   * @returns {number} Number of living neighbors
   */
  private getCountOfAliveNeighbors(x: number, y: number): number {
    let aliveCount = 0;

    for (let offset of this.directionOffsets) {
      const neighborX = x + offset.x;
      const neighborY = y + offset.y;
      if (this.isAlive(neighborX, neighborY)) aliveCount++;
    }

    return aliveCount;
  }

  /**
   * Check if the cell is alive
   * @param x Coords x of the cell
   * @param y Coords y of the cell
   * @returns {boolean} Return true if the cell is alive
   */
  private isAlive(x, y) {
    // check is the point is inside the board bound
    return x >= 0 && x < this.board.columns && y >= 0 && y < this.board.rows &&
      // check if the point is filled
      this.board.getStateAt(x, y) === true;
  }

  private static getSquaredNeighbors(): Coords[] {
    return [
      new Coords(-1, -1), new Coords(0, -1), new Coords(1, -1),
      new Coords(-1, 0)   /*   center    */, new Coords(1, 0),
      new Coords(-1, 1),  new Coords(0, +1), new Coords(1, 1)
    ]
  }

}