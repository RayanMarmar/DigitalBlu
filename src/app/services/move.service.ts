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

    stretchLinkedElements(delta: Point): void {
        if (this._archiveService.linkedPointsList !== null) {
            for (let i: number = 0; i < this._archiveService.linkedPointsList.length; i++) {
                this._archiveService.linkedPointsList[i].shiftElement(delta.x, delta.y)
            }
            for (let i: number = 0; i < this._archiveService.linkedElementsList.length; i++) {
                if (this._archiveService.linkedElementsList[i] instanceof Wall) {
                    let wall = this._archiveService.linkedElementsList[i] as Wall
                    wall.updateLines()
                }

            }
            // this.removeWallOpenings()
        }
    }

    moveLinkedElements(delta: Point): void {
        if (this._archiveService.linkedElementsList !== null) {
            for (let i: number = 0; i < this._archiveService.linkedElementsList.length; i++) {
                this._archiveService.linkedElementsList[i].shiftElement(delta.x, delta.y)
            }
        }
    }


    moveElement(delta: Point, element: Drawable): void {
        this._archiveService.getLinkedElements(element)
        if (element instanceof Window || Door) {
            try {
                element.shiftElement(delta.x, delta.y)
            } catch (e) {
                return
            }

        } else if (element instanceof Wall) {
            this.moveWallOpenings(
                element,
                delta,
            )
        } else {
            element.shiftElement(delta.x, delta.y)
        }

        if (element instanceof Wall || Line) {
            this.stretchLinkedElements(delta)
        }
    }

}
