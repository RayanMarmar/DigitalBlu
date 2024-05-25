import { Injectable } from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Line} from "../drawables/line";
import {TransformationService} from "./transformation.service";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import {WallOpening} from "../drawables/wallOpening";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";

@Injectable({
  providedIn: 'root'
})
export class CopyPasteService {

  private shift : number = 10
  private _copiedElement : Drawable | null = null ;
  constructor(
      private _archiveService: ArchiveService,
      private _transformationService: TransformationService
  ) { }

  get copiedElement(): Drawable | null {
    return this._copiedElement;
  }

  set copiedElement(value: Drawable | null) {
    this._copiedElement = value;
  }

  copyOpenings(wall : Wall, openings : WallOpening[]): void {

    if (openings.length <= 0){
      return ;
    }
    for (let i = 0; i < openings.length; i++) {
      if (openings[i] instanceof  Window){
        let x = openings[i] as Window;
        let newWindow = new Window(
            wall,
            new Point(x.center.x + this.shift, x.center.y + this.shift),
            x.width
        );
        wall.addWallOpening(newWindow) ;

      }else {
        let x = openings[i] as Door;
        let newDoor = new Door(
            wall,
            new Point(x.center.x + this.shift, x.center.y + this.shift),
            x.width
        );
        wall.addWallOpening(newDoor) ;
      }
    }
  }

  addOpenings(openings : WallOpening[]): void {
    if (openings.length <= 0){
      return ;
    }
    for (let i = 0; i < openings.length; i++) {
      if (openings[i] instanceof  Window){
        let x = openings[i] as Window;
        this._archiveService.addWindow(x)
      }else {
        let x = openings[i] as Door;
        this._archiveService.addDoor(x)
      }
    }
  }

  copyElement(element : Drawable | null) : Line | Wall | void {
    console.log("copying")
    if (element instanceof Line) {
      let e = element as Line ;
      let newLine =   new Line(
          new Point(element.firstPoint.x + this.shift , element.firstPoint.y + this.shift ),
          new Point(element.secondPoint.x + this.shift, element.secondPoint.y + this.shift),
          this._transformationService.reverseTransformationMatrix
      );
      this.copiedElement = newLine;
    }
    if (element instanceof Wall) {
      let e = element as Wall ;
      let newWall =   new Wall(
          new Point(element.firstLine.firstPoint.x + this.shift , element.firstLine.firstPoint.y + this.shift ),
          new Point(element.firstLine.secondPoint.x + this.shift, element.firstLine.secondPoint.y + this.shift),
          element.height,
          this._transformationService.reverseTransformationMatrix,
          null
      );
      this.copiedElement = newWall;
      this.copyOpenings(newWall,e.wallOpenings);
    }
    return
  }
  pasteElement() : void {
    console.log("pasting")
    if (this._copiedElement instanceof Line) {
      this._archiveService.addLine(this._copiedElement)
    }
    if (this._copiedElement instanceof Wall) {
      console.log("adding wall")
      console.log("element",this.copiedElement)
      let e = this._copiedElement as Wall
      this._archiveService.addWall(this._copiedElement)
      this.addOpenings(e.wallOpenings)
    }
  }
}


