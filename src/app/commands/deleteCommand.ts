import {Point} from "../drawables/point";
import {Line} from "../drawables/line";

export class DeleteCommand implements Command {

    constructor(
        private pointsList: Point[],
        private archivePointsList: Point[],
        private drawableList: Drawable[],
        private archiveDrawableList: Drawable[],
        private selectedElement: Drawable,
    ) {
        this.selectedElement = selectedElement;
    }

    execute(): void {
        if (this.selectedElement != null) {
            const index = this.drawableList.indexOf(this.selectedElement);
            if (index > -1) {
                this.archiveDrawableList.push(this.selectedElement);
                this.drawableList.splice(index, 1);
            }
        }
    }

    undo(): void {
        const index = this.archiveDrawableList.indexOf(this.selectedElement);
        if (index > -1) {
            let drawable = this.archiveDrawableList[index]
            this.drawableList.push(drawable);
            this.archiveDrawableList.splice(index, 1);
        }
    }

    removePoints(): void {
        this.archivePointsList.push(this.pointsList.pop()!!);
        if (this.ghostPoint()) {
            this.archivePointsList.push(this.pointsList.pop()!!);
        }
    }

    private ghostPoint(): boolean {
        if (this.drawableList.length == 0) return true;
        let drawable: Drawable = this.drawableList[this.drawableList.length - 1];
        // Check if the drawable is an instance of Line
        if (drawable instanceof Line) {
            const lastPoint = this.pointsList[this.pointsList.length - 1];
            // Call isLineExtremity only if drawable is a Line instance
            return !drawable.isLineExtremity(lastPoint);
        }

        // If drawable is not a Line instance, return false
        return false;
    }

    private shouldAddPoint(line: Line): boolean {
        let lastPoint: Point = this.archivePointsList[this.archivePointsList.length - 1];

        return lastPoint != undefined && line.isLineExtremity(lastPoint);
    }
}