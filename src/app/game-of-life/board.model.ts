export class Board {
  private _columns: number;
  private _rows: number;
  private _state: boolean[][];

  constructor(columns: number, rows: number) {
    this._columns = columns;
    this._rows = rows;
    this._state = [];
    this.init();
  }

  public getStateAt(row: number, column: number): boolean {
    return this._state[row][column];
  }

  public setStateAt(row: number, column: number, state: boolean) {
    this._state[row][column] = state;
  }

  get columns(): number {
    return this._columns;
  }

  get rows(): number {
    return this._rows;
  }

  private init() {
    for (let row = 0; row < this._rows; row++) {
      this._state.push([]);
      for (let column = 0; column < this._columns; column++) {
        this._state[row].push(false);
      }
    }
  }

}