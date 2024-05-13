import {Injectable} from '@angular/core';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {ArchiveService} from "./archive.service";
import {GridService} from "./grid.service";
import {Point} from "../drawables/point";

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
        if (this.modesConfiguration.gridOn) {
            snapped = this.gridService.calculateNearestGridIntersection(point);
        }
        return snapped;
    }
}
