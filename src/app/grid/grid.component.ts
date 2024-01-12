import { Component } from '@angular/core';
import {GridItemComponent} from "./grid-item/grid-item.component";
import {NgForOf} from "@angular/common";
import {GridService} from "./grid.service";

@Component({
  selector: 'grid-table',
  standalone: true,
  imports: [GridItemComponent, NgForOf],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent{
  rows: number[];
  constructor(service: GridService) {
    this.rows = service.numRowsArray;
  }
}
