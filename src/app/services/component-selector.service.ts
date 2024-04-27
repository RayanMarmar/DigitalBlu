import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Point} from "../drawables/point"

@Injectable({
    providedIn: 'root'
})
export class ComponentSelectorService {

    constructor(
        private archiveService: ArchiveService,
    ) {

    }

    getNearestComponent(point: Point): Drawable | null {
        const {min: minOpeningDistance, minElement: minOpening} = this.archiveService.getNearestWallOpening(point);
        const {min: minWallDistance, minElement: minWall} = this.archiveService.getNearestWall(point);
        const {min: minLineDistance, minElement: minLine} = this.archiveService.getNearestLine(point);
        let maxAllowedDistance = 30;

        if (minOpening !== null && minOpeningDistance <= minWallDistance && minOpeningDistance < minLineDistance && minOpeningDistance <= maxAllowedDistance) {
            console.log("returning opening", minOpeningDistance);
            return minOpening as null | Drawable;
        }
        if (minWallDistance !== Infinity && minWallDistance < minOpeningDistance && minWallDistance < minLineDistance && minWallDistance <= maxAllowedDistance) {
            console.log("returning wall", minWallDistance);
            return minWall;
        }
        if (minLineDistance !== Infinity && minLineDistance < minWallDistance && minLineDistance < minOpeningDistance && minLineDistance <= maxAllowedDistance) {
            console.log("returning Line", minLineDistance);
            return minLine;
        }
        return null;
    }
}
