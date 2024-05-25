import {WallOpening} from "../drawables/wallOpening";
import {LinkedDrawables} from "../models/linkedDrawables";

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
                this.linkedDrawables.linkDrawable(drawable);
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
                this.linkedDrawables.unlinkDrawable(drawable);
            }
        }
    }
}