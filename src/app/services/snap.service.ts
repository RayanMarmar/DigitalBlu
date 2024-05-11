import {Injectable} from '@angular/core';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {ArchiveService} from "./archive.service";
import {GridService} from "./grid.service";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";

@Injectable({
    providedIn: 'root'
})
export class SnapService {

    constructor(
        private readonly mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private readonly archiveService: ArchiveService,
        private readonly gridService: GridService
    ) {
    }

    snapPoint(): Point {
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = point;
        if (this.modesConfiguration.snapMode) {
            snapped = this.archiveService.snapPoint(point, true);
            if (!snapped.equals(point)) {
                return snapped;
            }
        }
        if (this.modesConfiguration.drawing &&
            (this.modesConfiguration.snapAngleMode || this.modesConfiguration.straightLineMode)) {
            return this.archiveService.snapAngle(
                this.mouse.clickedCoordinates!!,
                this.mouse.currentCoordinates!!,
                this.modesConfiguration.snapAngle!!
            )
        }
        if (this.modesConfiguration.gridOn && !this.modesConfiguration.moveMode) {
            snapped = this.gridService.calculateNearestGridIntersection(point);
        }
        return snapped;
    }
    snapElementPoints(): void{
        console.log("snapping",this.archiveService.selectedElement?.toString())

        let wall  = this.archiveService.selectedElement as Wall
        let p1 = wall.firstPoint
        let p2 = wall.secondPoint
        let snapped1: Point = wall.firstPoint;
        let snapped2: Point = wall.secondPoint;
        if (this.modesConfiguration.snapMode && this.modesConfiguration.moveMode) {
            console.log("in Snap mode ")
            snapped1 = this.archiveService.snapPoint(p1, true);
            snapped2 = this.archiveService.snapPoint(p2, true);
            if (!snapped1.equals(wall.firstPoint)) {

                wall.firstPoint =  snapped1;
                wall.updateLines()
            }
            if (!snapped2.equals(wall.secondPoint)) {
                wall.secondPoint =  snapped2;
                wall.updateLines()
            }
        }

        if (this.modesConfiguration.gridOn && !this.modesConfiguration.moveMode) {
            console.log("in move mode")
            wall.firstPoint = this.gridService.calculateNearestGridIntersection(wall.firstPoint);
            wall.secondPoint = this.gridService.calculateNearestGridIntersection(wall.secondPoint);
            wall.updateLines()
        }
        console.log("after snapping",this.archiveService.selectedElement)
    }

}
