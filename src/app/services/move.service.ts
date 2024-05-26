import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Wall} from "../drawables/wall";
import {Point} from "../drawables/point";
import {Line} from "../drawables/line";

@Injectable({
    providedIn: 'root'
})
export class MoveService {
    constructor(
        private _archiveService: ArchiveService,
    ) {
    }

    calculateDeltaCoordinates(source: Point, target: Point): Point {
        return new Point(
            Math.round(target.x - source.x),
            Math.round(target.y - source.y)
        )
    }

    stretchLinkedElements(delta: Point, total: Point, selectedDrawable: Drawable, updateKeys: boolean): void {
        if (selectedDrawable instanceof Wall || selectedDrawable instanceof Line) {
            for (let i: number = 0; i < selectedDrawable.extremities.length; i++) {
                let originalExtremityCoordinates = new Point(selectedDrawable.extremities[i].x - total.x, selectedDrawable.extremities[i].y - total.y);
                let previousExtremityCoordinates = new Point(selectedDrawable.extremities[i].x - delta.x, selectedDrawable.extremities[i].y - delta.y);
                console.log(originalExtremityCoordinates.toString());
                const linkedElements: Drawable[] = this._archiveService.linkedDrawables.get(originalExtremityCoordinates);

                for (let j: number = 0; j < linkedElements.length; j++) {
                    this._archiveService.updateDrawable(previousExtremityCoordinates, linkedElements[j], delta);
                    linkedElements[j].shiftExtremity(previousExtremityCoordinates, delta.x, delta.y);
                }

                if (updateKeys) {
                    this._archiveService.linkedDrawables.updateKey(originalExtremityCoordinates, selectedDrawable.extremities[i]);
                }
            }
        }
    }

    moveElement(delta: Point, element: Drawable, total: Point = new Point(0, 0), updateKeys: boolean = false): void {
        element.shiftElement(delta.x, delta.y)

        this.stretchLinkedElements(delta, total, element, updateKeys);
    }
}
