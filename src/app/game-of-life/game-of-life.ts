import { Coords } from "./coords.model";
import { Board } from "./board.model";

export class GameOfLife {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private board: Board;
  private cellDimension: number;
  private directionOffsets: Coords[] = [
    new Coords(-1, -1), new Coords(0, -1), new Coords(1, -1),
    new Coords(-1, 0)   /*   center    */, new Coords(1, 0),
    new Coords(-1, 1),  new Coords(0, +1), new Coords(1, 1)
  ];

  constructor(public canvasId: string = "board") {
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.ctx.strokeStyle = '#e1e1e1';
    this.ctx.fillStyle = 'cadetblue';
    this.cellDimension = 10;
    this.board = this.initBoard();
    this.seedBoard();
    this.render();

    this.canvas.addEventListener('mouseup', (event) => {
      let canvasMousePosition = this.getCanvasMousePosition(event);
      this.changeCellState(canvasMousePosition);
    })
  }

  public start() {
    this.nextFrame();
  }

  private initBoard(): Board {
    const cols = Math.floor(this.canvas.width / this.cellDimension);
    const rows = Math.floor(this.canvas.height / this.cellDimension);
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
    const startingCol = Math.floor((this.board.rows / 2) - (fillerColumns / 2));
    const startingRow = Math.floor((this.board.columns / 2) - (fillerRows / 2));

    for (let row = 0; row < fillerRows; row++) {
      for (let column = 0; column < fillerColumns; column++) {
        this.board.setStateAt(startingCol + column, startingRow + row, spaceFiller[row][column] == "1");
      }
    }
  }

  private nextFrame() {
    this.update();
    this.render();
    setTimeout(() => {
      this.nextFrame();
    }, 70);
    // requestAnimationFrame(this.nextFrame.bind(this)); // Too fast!
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let row = 0; row < this.board.rows; row++) {
      for (let column = 0; column < this.board.columns; column++) {
        this.ctx.beginPath();
        let cellCoords = this.getCellCoords(row, column);
        this.ctx.rect(cellCoords.x, cellCoords.y, this.cellDimension, this.cellDimension);
        if (this.board.getStateAt(row, column)) this.ctx.fill();
        else this.ctx.stroke();
      }
    }
  }

  private update() {
    const nextBoard: Board = this.initBoard();

    for (let row = 0; row < this.board.rows; row++) {
      for (let column = 0; column < this.board.columns; column++) {
        nextBoard.setStateAt(row, column, this.getCellFate(row, column));
      }
    }

    this.board = nextBoard;
  }

  private getCellFate(row: number, column: number): boolean {
    const aliveNeighborsCount = this.getCountOfAliveNeighbors(row, column);
    const cellCurrentState: boolean = this.board.getStateAt(row, column);

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
   * @param row
   * @param column
   * @returns {number} Number of living neighbors
   */
  private getCountOfAliveNeighbors(row: number, column: number): number {
    let aliveCount = 0;

    for (let offset of this.directionOffsets) {
      const neighborX = row + offset.x;
      const neighborY = column + offset.y;
      if (
        // check if the point is inside the board bound
        neighborX >= 0 && neighborX < this.board.rows &&
        neighborY >= 0 && neighborY < this.board.columns &&
        // check if the point is filled
        this.board.getStateAt(neighborX, neighborY) === true
      ) aliveCount++;
    }

    return aliveCount;
  }

  public getCellCoords(row: number, column: number): Coords {
    return new Coords(row * this.cellDimension, column * this.cellDimension);
  }

  private changeCellState(mouse) {
    let col = Math.floor(mouse.x / this.cellDimension);
    let row = Math.floor(mouse.y / this.cellDimension);
    let newState = !this.board.getStateAt(col, row);
    this.board.setStateAt(col, row, newState);
    this.renderCell(col, row, newState);
  }

  private renderCell(row, col, state) {
    let cellCoords:Coords = this.getCellCoords(row, col);
    this.ctx.clearRect(cellCoords.x, cellCoords.y, this.cellDimension, this.cellDimension);
    this.ctx.beginPath();
    this.ctx.rect(cellCoords.x, cellCoords.y, this.cellDimension, this.cellDimension);
    if (state) this.ctx.fill();
    else this.ctx.stroke();
  }

  private getCanvasMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

}