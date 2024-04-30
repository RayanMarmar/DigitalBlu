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

        if (minOpening !== null && minOpeningDistance <= minWallDistance && minOpeningDistance <= minLineDistance && minOpeningDistance <= maxAllowedDistance) {
            return minOpening;
        }
        if (minWallDistance !== Infinity && minWallDistance < minOpeningDistance && minWallDistance < minLineDistance && minWallDistance <= maxAllowedDistance) {
            return minWall;
        }
        if (minLineDistance !== Infinity && minLineDistance < minWallDistance && minLineDistance < minOpeningDistance && minLineDistance <= maxAllowedDistance) {
            return minLine;
        }
        return null;
    }
}
