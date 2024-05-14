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
            //console.log(selectedDrawable.toString())
            //console.log(this._archiveService.linkedDrawables.toString())
            for (let i: number = 0; i < selectedDrawable.extremities.length; i++) {
                const linkedElements: Drawable[] = this._archiveService.linkedDrawables.get(selectedDrawable.extremities[i]);
                //console.log('linked elements : ' + linkedElements.length)

                for (let j: number = 0; j < linkedElements.length; j++) {
                    if (!linkedElements[j].equals(selectedDrawable)) {
                        this._archiveService.updateDrawable(selectedDrawable.extremities[i], linkedElements[j], delta);
                    }
                    linkedElements[j].shiftExtremity(selectedDrawable.extremities[i], delta.x, delta.y);
                }

                let oldExtremity = new Point(selectedDrawable.extremities[i].x, selectedDrawable.extremities[i].y);
                let newExtremity = new Point(selectedDrawable.extremities[i].x + delta.x, selectedDrawable.extremities[i].y + delta.y);
                this._archiveService.linkedDrawables.updateKey(oldExtremity, newExtremity);

            }
        }
    }

    moveElement(delta: Point, element: Drawable): void {
        this.stretchLinkedElements(delta, element);
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
    }
}
