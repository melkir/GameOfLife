import { Component } from "@angular/core";
import { GameOfLife } from "./game-of-life";
import { SpaceFiller } from "./spaceFiller";

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})
export class GameOfLifeComponent {

  private gol: GameOfLife;
  private spaceFillers;
  private chosenSpaceFiller;

  constructor() {
    this.spaceFillers = SpaceFiller;
    this.chosenSpaceFiller = SpaceFiller[1];
  }

  ngAfterViewInit() {
    this.gol = new GameOfLife();
  }

  play() {
    this.gol.start();
  }

  pause() {
    this.gol.pause();
  }

  stop() {
    this.gol.reset();
  }

  next() {
    this.gol.next();
  }

  onChange(event) {
    this.gol.changeFiller(event.value, event.cell);
  }

}
