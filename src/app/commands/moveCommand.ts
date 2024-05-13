import {Point} from "../drawables/point";
import {MoveService} from "../services/move.service";
import {SnapService} from "../services/snap.service";


export class MoveCommand implements Command{

    constructor(
        private delta : Point,
        private element : Drawable
    ) {
    }
    execute(): void {
    }

    undo(): void {
    }

}