import {Injectable} from '@angular/core';
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

  private shift : number = 20
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
            new Point(x.base[0].firstPoint.x + this.shift, x.base[0].firstPoint.y + this.shift),
            x.width
        );
        wall.addWallOpening(newWindow) ;

      }else {
        let x = openings[i] as Door;
        let newDoor = new Door(
            wall,
            new Point(x.base[0].firstPoint.x + this.shift, x.base[0].firstPoint.y + this.shift),
            x.doorType,
            x.direction,
            x.width,
            x.radius
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
        this._archiveService.pushWindow(x)
      }else if (openings[i] instanceof  Door){
        let x = openings[i] as Door;
        this._archiveService.pushDoor(x)
      }
    }
  }

  copyElement(element : Drawable | null) : Line | Wall | void {
    if (element instanceof Line) {
      let e = element as Line ;
      this.copiedElement = new Line(
          new Point(element.firstPoint.x + this.shift, element.firstPoint.y + this.shift),
          new Point(element.secondPoint.x + this.shift, element.secondPoint.y + this.shift),
          this._transformationService.reverseTransformationMatrix
      );
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
    if (this._copiedElement instanceof Line) {
      this._archiveService.pushLine(this._copiedElement)
      this._archiveService.addLine(this._copiedElement)
    }
    if (this._copiedElement instanceof Wall) {
      let e = this._copiedElement as Wall
      this._archiveService.pushWall(this._copiedElement)
      this._archiveService.addWall(this._copiedElement)
      this.addOpenings(e.wallOpenings)
    }
  }

  deleteElement() : void {
    if (this._copiedElement instanceof Line) {
      this._archiveService.deleteElement(
          this._archiveService.copiedElement!,
          this._archiveService.linesList,
          this._archiveService.archiveLinesList
      )
    }
    if (this._copiedElement instanceof Wall) {
      this._archiveService.deleteElement(
          this._archiveService.copiedElement!,
          this._archiveService.wallsList,
          this._archiveService.archiveWallsList
      )
    }
  }
}


