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

        if (minOpening !== null && minOpeningDistance <= minWallDistance && minOpeningDistance <= minLineDistance && minOpeningDistance <= maxAllowedDistance) {
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
        if (minWallDistance !== Infinity && minWallDistance < minOpeningDistance && minWallDistance < minLineDistance && minWallDistance <= maxAllowedDistance) {
            return {
                component: minWall,
                list: this.archiveService.wallsList,
                archiveList: this.archiveService.archiveWallsList
            };
        }
        if (minLineDistance !== Infinity && minLineDistance < minWallDistance && minLineDistance < minOpeningDistance && minLineDistance <= maxAllowedDistance) {
            return {
                component: minLine,
                list: this.archiveService.linesList,
                archiveList: this.archiveService.archiveLinesList
            };
        }
        return {component: null, list: null, archiveList: null};
    }

}
