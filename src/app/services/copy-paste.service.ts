import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Line} from "../drawables/line";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";
@Injectable({
  providedIn: 'root'
})
export class CopyPasteService {

  private shiftDistance : number = 20
  private copiedElement : Drawable | null = null ;
  constructor(
      private archiveService: ArchiveService,
  ) { }

  copy(): void {
    if(this.archiveService.selectedElement){
      this.copiedElement = this.archiveService.selectedElement.clone();
      this.copiedElement.shiftElement(this.shiftDistance,this.shiftDistance);
    }
  }

  paste() : void {
    if (this.copiedElement instanceof Line) {
      this.archiveService.pushLine(this.copiedElement);
      this.archiveService.addLine(this.copiedElement);
    }
    if (this.copiedElement instanceof Wall) {
      this.archiveService.pushWall(this.copiedElement);
      this.archiveService.addWall(this.copiedElement);
    }
    if (this.copiedElement instanceof Door) {
      this.archiveService.addDoor(this.copiedElement);
    }
    if (this.copiedElement instanceof Window) {
      this.archiveService.addWindow(this.copiedElement);
    }
  }
}


