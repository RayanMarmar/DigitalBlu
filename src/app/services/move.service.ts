import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";
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

    calculateDeltaCoord(source: Point, target: Point): Point {
        return new Point(
            target.x - source.x,
            target.y - source.y
        )
    }

    moveWallOpenings(wall: Wall, delta: Point) {
        for (let i = 0; i < this._archiveService.windowsList.length; i++) {
            let window = this._archiveService.windowsList[i];

            // Check if the wall of the window is equal to the selected wall
            if (window.wall === wall) {
                try {
                    console.log("moving window")
                    window.shiftElement(delta.x, delta.y)
                } catch (e) {
                    this._archiveService.windowsList.splice(i, 1);
                    i--; // Adjust the loop index since we removed an element
                }
            }
        }
        // Iterate over the door list
        for (let i = 0; i < this._archiveService.doorsList.length; i++) {
            let door = this._archiveService.doorsList[i];

            // Check if the wall of the door is equal to the selected wall
            if (door.wall === wall) {
                try {
                    console.log("moving door", this._archiveService.doorsList[i])
                    door.shiftElement(delta.x, delta.y)
                } catch (e) {
                    this._archiveService.doorsList.splice(i, 1);
                    i--; // Adjust the loop index since we removed an element
                }


            }
        }
    }

    stretchLinkedElements(delta: Point, selectedDrawable: Drawable): void {
        if (selectedDrawable instanceof Wall || selectedDrawable instanceof Line) {
            let linkedElements = this._archiveService.linkedDrawables
                .get(selectedDrawable.extremities[0])
                .concat(
                    this._archiveService.linkedDrawables.get(selectedDrawable.extremities[1])
                );
            for (let i: number = 0; i < linkedElements.length; i++) {
                linkedElements[i].shiftExtremity(selectedDrawable.extremities[0], delta.x, delta.y);
                linkedElements[i].shiftExtremity(selectedDrawable.extremities[1], delta.x, delta.y);
            }
        }
    }

    moveElement(delta: Point, element: Drawable): void {
        try {
            element.shiftElement(delta.x, delta.y)
        } catch (e) {
            if (element instanceof Window || Door) {
                //remove opening
            }
            return
        }

        if (element instanceof Wall) {
            this.moveWallOpenings(
                element,
                delta,
            )
        }
        this.stretchLinkedElements(delta, element);
    }
}
