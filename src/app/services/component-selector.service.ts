import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Point} from "../drawables/point"
import {Door} from "../drawables/door";

@Injectable({
    providedIn: 'root'
})
export class ComponentSelectorService {

    constructor(
        private archiveService: ArchiveService,
    ) {

    }

    getNearestComponent(point: Point): {
        component: Drawable | null,
        list: Drawable[] | null,
        archiveList: Drawable[] | null
    } {
        const {min: minOpeningDistance, minElement: minOpening} = this.archiveService.getNearestWallOpening(point);
        const {min: minWallDistance, minElement: minWall} = this.archiveService.getNearestWall(point);
        const {min: minLineDistance, minElement: minLine} = this.archiveService.getNearestLine(point);
        let maxAllowedDistance = 30;

        if (this.isOpeningMin(minOpening, minOpeningDistance, maxAllowedDistance, minWallDistance, minLineDistance)) {
            if (minOpening instanceof Door) {
                return {
                    component: minOpening,
                    list: this.archiveService.doorsList,
                    archiveList: this.archiveService.archiveDoorsList
                };
            }
            return {
                component: minOpening,
                list: this.archiveService.windowsList,
                archiveList: this.archiveService.archiveWindowsList
            };

        }

        if (this.isOpeningMin(minWall, minWallDistance, maxAllowedDistance, minLineDistance, minLineDistance)) {
            return {
                component: minWall,
                list: this.archiveService.wallsList,
                archiveList: this.archiveService.archiveWallsList
            };
        }
        if (this.isOpeningMin(minLine, minLineDistance, maxAllowedDistance, minWallDistance, minOpeningDistance)) {
            return {
                component: minLine,
                list: this.archiveService.linesList,
                archiveList: this.archiveService.archiveLinesList
            };
        }
        return {component: null, list: null, archiveList: null};
    }

    isOpeningMin(component: Drawable | null, distance: number, maxAllowedDistance: number, minDistance1: number, minDistance2: number): boolean {
        return component !== null && distance <= minDistance1 && distance <= minDistance2 && distance <= maxAllowedDistance;
    }

}
