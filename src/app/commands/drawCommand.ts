import {Line} from "../drawables/line";
import {WallOpening} from "../drawables/wallOpening";
import {LinkedDrawables} from "../models/linkedDrawables";
import {Wall} from "../drawables/wall";

export class DrawCommand implements Command {

    constructor(
        private linkedDrawables: LinkedDrawables,
        private drawableList: Drawable[],
        private archiveDrawableList: Drawable[],
    ) {
    }

    execute(): void {
        let drawable: Drawable | undefined = this.archiveDrawableList.pop();
        if (drawable != undefined) {
            this.drawableList.push(drawable);
            if (drawable instanceof WallOpening) {
                drawable.wall.addWallOpening(drawable);
            } else {
                this.linkDrawable(drawable);
            }
        }
    }

    undo(): void {
        let drawable: Drawable | undefined = this.drawableList.pop();
        if (drawable != undefined) {
            this.archiveDrawableList.push(drawable);
            if (drawable instanceof WallOpening) {
                drawable.wall.removeWallOpening(drawable);
            } else {
                this.unlinkDrawable(drawable);
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
}