import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Point} from "../drawables/point"
import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";
import {WallOpening} from "../drawables/wallOpening";

@Injectable({
    providedIn: 'root'
})
export class ComponentSelectorService {

    constructor(
        private archiveService: ArchiveService,
    ) {

    }

    getNearestComponent(point: Point): Wall | Line | WallOpening | void {


        const {min: minOpeningDistance, minElement: minOpening} = this.archiveService.getNearestWallOpening(point)
        const {min: minWallDistance, minElement: minWall} = this.archiveService.getNearestWall(point)
        const {min: minLineDistance, minElement: minLine} = this.archiveService.getNearestLine(point)
        let maxAllowedDistance = 100;

        if (minOpeningDistance < minWallDistance && minOpeningDistance < minLineDistance && minOpeningDistance <= maxAllowedDistance) {
            console.log("returning opening", minOpeningDistance);
            return minOpening;
        }
        if (minWallDistance < minOpeningDistance && minWallDistance < minLineDistance && minWallDistance <= maxAllowedDistance) {
            console.log("returning wall", minWallDistance);
            return minWall;
        }
        if (minLineDistance < minWallDistance && minLineDistance < minOpeningDistance && minLineDistance <= maxAllowedDistance) {
            console.log("returning Line", minLineDistance);
            return minLine;
        }
        console.log("nothing found")

    }
}
