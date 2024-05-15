import {Point} from "../drawables/point";
import {MoveService} from "../services/move.service";


export class MoveCommand implements Command {
    constructor(
        private delta: Point,
        private element: Drawable,
        private moveService: MoveService,
    ) {
    }

    execute(): void {
        this.moveService.moveElement(this.delta, this.element, this.delta, true)
    }

    undo(): void {
        this.moveService.moveElement(this.reverseDelta(), this.element, this.reverseDelta(), true)
    }

    private reverseDelta(): Point {
        let x = -this.delta.x;
        let y = -this.delta.y;
        return new Point(x, y)
    }
}