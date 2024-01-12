import { Component } from '@angular/core';
import {GridItemComponent} from "./grid-item/grid-item.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'grid-table',
  standalone: true,
  imports: [GridItemComponent, NgForOf],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent{
  private numRows = 10;
  private numCols = 10;
  constructor() {
  }
  get numRowsArray(): number[] {
    return Array(this.numRows * this.numCols).fill(0).map((_, index) => index);
  }
}
