import {Point} from "../drawables/point";
import {Line} from "../drawables/line";
import {Wall} from "../drawables/wall";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";

export class DeleteCommand implements Command {

    constructor(
        private pointsList: Point[],
        private archivePointsList: Point[],
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
                if (this.selectedElement instanceof Wall) {
                    this.removeSelectedElementOpenings();
                }
                if (this.selectedElement instanceof Line) {
                    this.removeSelectedElementPoints();
                }
            }
        }
    }

    undo(): void {
        const index = this.archiveDrawableList.indexOf(this.selectedElement);
        if (index > -1) {
            let drawable = this.archiveDrawableList[index]
            this.drawableList.push(drawable);
            this.archiveDrawableList.splice(index, 1);
            this.pointsList.push(this.archivePointsList.pop()!!)
            if (drawable instanceof Line && this.shouldAddPoint(drawable)) {
                this.pointsList.push(this.archivePointsList.pop()!!);
            }
            if (drawable instanceof Wall) {
                this.addOpenings();
            }
        }
    }

    removeSelectedElementPoints(): void {
        const line = this.selectedElement as Line;

        // Iterate over the archivePointsList
        for (let i = 0, x = 0; i < this.pointsList.length && x < 2; i++) {
            const point = this.pointsList[i];

            // Check if the point is equal to the firstPoint or secondPoint of the Line
            if (point.equals(line.firstPoint) || point.equals(line.secondPoint)) {
                // Remove the point from the archivePointsList
                if (this.ghostPoint(point)) {
                    this.archivePointsList.push(point);
                    this.pointsList.splice(i, 1);
                    i--; // Adjust the loop index since we removed an element
                    x++;
                }

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


    private ghostPoint(point: Point): boolean {
        if (this.drawableList.length == 0) return true;
        let drawable: Line = this.selectedElement as Line
        // Check if the drawable is an instance of Line
        // Call isLineExtremity only if drawable is a Line instance
        return !drawable.isLineExtremity(point);
    }

    private shouldAddPoint(line: Line): boolean {
        let lastPoint: Point = this.archivePointsList[this.archivePointsList.length - 1];

        return lastPoint != undefined && line.isLineExtremity(lastPoint);
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