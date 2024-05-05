import {Point} from "../drawables/point";
import {Line} from "../drawables/line";

export class DeleteCommand implements Command {

    constructor(
        private pointsList: Point[],
        private archivePointsList: Point[],
        private drawableList: Drawable[],
        private archiveDrawableList: Drawable[],
        private selectedElement: Drawable | null = null,
    ) {
        this.selectedElement = selectedElement;
    }

    redo(): void {
        let drawable: Drawable | undefined = this.drawableList.pop();
        if (drawable != undefined) {
            this.archiveDrawableList.push(drawable);
            if (drawable instanceof Line) {
                this.removePoints();
            }
        }
    }

    undo(): void {
        let drawable: Drawable | undefined = this.archiveDrawableList.pop();
        if (drawable != undefined) {
            this.drawableList.push(drawable);
            this.pointsList.push(this.archivePointsList.pop()!!);
            if (drawable instanceof Line && this.shouldAddPoint(drawable)) {
                this.pointsList.push(this.archivePointsList.pop()!!);
            }
        }
    }

    delete(): void {
        if (this.selectedElement != null) {
            const index = this.drawableList.indexOf(this.selectedElement);
            if (index > -1) {
                this.drawableList.splice(index, 1);
                if (this.selectedElement instanceof Line) {
                    this.removePoints();
                }
            }
            this.archiveDrawableList.push(this.selectedElement);
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