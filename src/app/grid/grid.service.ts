import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private numRows = 10;
  private numCols = 10;
  constructor() {
  }
  get numRowsArray(): number[] {
    return Array(this.numRows * this.numCols).fill(0).map((_, index) => index);
  }
}
