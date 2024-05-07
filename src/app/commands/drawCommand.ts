import {Point} from "../drawables/point";
import {Line} from "../drawables/line";

export class DrawCommand implements Command {

    constructor(
        private pointsList: Point[],
        private archivePointsList: Point[],
        private drawableList: Drawable[],
        private archiveDrawableList: Drawable[],
    ) {
    }

    execute(): void {
        let drawable: Drawable | undefined = this.archiveDrawableList.pop();
        if (drawable != undefined) {
            this.drawableList.push(drawable);
            this.pointsList.push(this.archivePointsList.pop()!!);
            if (drawable instanceof Line && this.shouldAddPoint(drawable)) {
                this.pointsList.push(this.archivePointsList.pop()!!);
            }
        }
    }

    undo(): void {
        let drawable: Drawable | undefined = this.drawableList.pop();
        if (drawable != undefined) {
            this.archiveDrawableList.push(drawable);
            if (drawable instanceof Line) {
                this.removePoints();
            }
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