import { Component } from "@angular/core";
import { GameOfLife } from "./game-of-life";

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})
export class GameOfLifeComponent {

  constructor() {
  }

  ngAfterViewInit() {
    new GameOfLife().start();
  }

}
