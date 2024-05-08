import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Point} from "../drawables/point"
import {Door} from "../drawables/door";

@Injectable({
    providedIn: 'root'
})
export class ComponentSelectorService {

    private readonly maxAllowedDistance: number = 30;

    constructor(
        private archiveService: ArchiveService,
    ) {

    }

    getNearestComponent(point: Point): {
        component: Drawable | null,
        list: Drawable[] | null,
        archiveList: Drawable[] | null,
        nearestPoint: Point | null
    } {
        const {min: minOpeningDistance, minElement: minOpening,nearestPoint: openingPoint} = this.archiveService.getNearestWallOpening(point);
        const {min: minWallDistance, minElement: minWall,nearestPoint: wallPoint} = this.archiveService.getNearestWall(point);
        const {min: minLineDistance, minElement: minLine,nearestPoint: linePoint} = this.archiveService.getNearestLine(point);

        if (this.isOpeningMin(minOpening, minOpeningDistance, this.maxAllowedDistance, minWallDistance, minLineDistance)) {
            if (minOpening instanceof Door) {
                return {
                    component: minOpening,
                    list: this.archiveService.doorsList,
                    archiveList: this.archiveService.archiveDoorsList,
                    nearestPoint : openingPoint
                };
            }
            return {
                component: minOpening,
                list: this.archiveService.windowsList,
                archiveList: this.archiveService.archiveWindowsList,
                nearestPoint : openingPoint
            };

        }

        if (this.isOpeningMin(minWall, minWallDistance, this.maxAllowedDistance, minLineDistance, minLineDistance)) {
            return {
                component: minWall,
                list: this.archiveService.wallsList,
                archiveList: this.archiveService.archiveWallsList,
                nearestPoint:wallPoint
            };
        }
        if (this.isOpeningMin(minLine, minLineDistance, this.maxAllowedDistance, minWallDistance, minOpeningDistance)) {
            return {
                component: minLine,
                list: this.archiveService.linesList,
                archiveList: this.archiveService.archiveLinesList,
                nearestPoint: linePoint
            };
        }
        return {component: null, list: null, archiveList: null,nearestPoint: null};
    }

    isOpeningMin(component: Drawable | null, distance: number, maxAllowedDistance: number, minDistance1: number, minDistance2: number): boolean {
        return component !== null && distance <= minDistance1 && distance <= minDistance2 && distance <= maxAllowedDistance;
    }

}
