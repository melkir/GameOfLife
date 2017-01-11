import { Component } from "@angular/core";
import { GameOfLife } from "./game-of-life";

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})
export class GameOfLifeComponent {

  private gol:GameOfLife;

  constructor() {
  }

  ngAfterViewInit() {
    this.gol = new GameOfLife();
  }

  play() {
    this.gol.start();
  }

  pause() {
  }

  stop() {
  }

  next() {
  }

}
