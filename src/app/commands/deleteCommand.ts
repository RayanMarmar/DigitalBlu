import {Line} from "../drawables/line";
import {Wall} from "../drawables/wall";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";
import {LinkedDrawables} from "../models/linkedDrawables";

export class DeleteCommand implements Command {

    constructor(
        private linkedDrawables: LinkedDrawables,
        private _windowsList: Window[],
        private _archiveWindowsList: Window[],
        private _doorsList: Door[],
        private _archiveDoorsList: Door[],
        private drawableList: Drawable[],
        private archiveDrawableList: Drawable[],
        private selectedElement: Drawable,
        private nbDeletedDoors: number = 0,
        private nbDeletedWindows: number = 0
    ) {
    }

    execute(): void {
        if (this.selectedElement != null) {
            const index = this.drawableList.indexOf(this.selectedElement);
            if (index > -1) {
                this.archiveDrawableList.push(this.selectedElement);
                this.drawableList.splice(index, 1);
                if (this.selectedElement instanceof Line) {
                    this.unlinkDrawable(this.selectedElement);
                }
                if (this.selectedElement instanceof Wall) {
                    this.removeSelectedElementOpenings();
                    this.unlinkDrawable(this.selectedElement);
                }
            }
        }
        console.log(this.linkedDrawables)
    }

    undo(): void {
        const index = this.archiveDrawableList.indexOf(this.selectedElement);
        if (index > -1) {
            let drawable = this.archiveDrawableList[index]
            this.drawableList.push(drawable);
            this.archiveDrawableList.splice(index, 1);
            if (drawable instanceof Line) {
                this.linkDrawable(drawable);
            }
            if (drawable instanceof Wall) {
                this.addOpenings();
                this.linkDrawable(drawable);
            }
        }
    }

    removeSelectedElementOpenings(): void {
        const wall = this.selectedElement as Wall
        // Iterate over the window and door list

        for (let i = 0; i < wall.wallOpenings.length; i++) {
            let wallOpening = wall.wallOpenings[i];
            if (wallOpening instanceof Door) {
                this._archiveDoorsList.push(wallOpening);
                let index = this._doorsList.indexOf(wallOpening);
                this._doorsList.splice(index, 1);
                this.nbDeletedDoors++;
            } else if (wallOpening instanceof Window) {
                this._archiveWindowsList.push(wallOpening);
                let index = this._windowsList.indexOf(wallOpening);
                this._windowsList.splice(index, 1);
                this.nbDeletedWindows++;
            }
        }
    }

    private unlinkDrawable(drawable: Drawable): void {
        if (drawable instanceof Line) {
            this.linkedDrawables.removeDrawable(drawable.firstPoint, drawable);
            this.linkedDrawables.removeDrawable(drawable.secondPoint, drawable);

        } else if (drawable instanceof Wall) {
            this.linkedDrawables.removeDrawable(drawable.fourthLine.calculateCenter(), drawable);
            this.linkedDrawables.removeDrawable(drawable.secondLine.calculateCenter(), drawable);
        }
    }

    private linkDrawable(drawable: Drawable): void {
        if (drawable instanceof Line) {
            this.linkedDrawables.addDrawable(drawable.firstPoint, drawable);
            this.linkedDrawables.addDrawable(drawable.secondPoint, drawable);

        } else if (drawable instanceof Wall) {
            this.linkedDrawables.addDrawable(drawable.fourthLine.calculateCenter(), drawable);
            this.linkedDrawables.addDrawable(drawable.secondLine.calculateCenter(), drawable);
        }
    }

    private addOpenings(): void {
        for (let i = 0; i < this.nbDeletedWindows; i++) {
            this._windowsList.push(this._archiveWindowsList.pop()!!)
        }
        for (let i = 0; i < this.nbDeletedDoors; i++) {
            this._doorsList.push(this._archiveDoorsList.pop()!!)
        }
        this.nbDeletedDoors = 0;
        this.nbDeletedWindows = 0;
    }
}