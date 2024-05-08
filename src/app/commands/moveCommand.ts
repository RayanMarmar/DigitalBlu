import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";
import {TransformationService} from "../services/transformation.service";

export class MoveCommand implements Command{


    constructor(
        private selectedElement: Drawable,
        private _source : Point,
        private _target : Point,
        private list: Line[],
    ) {
    }
    execute(): void {
        this.moveElement()
    }

    undo(): void {

    }
    calculateCoordDelta():Point{
        return new Point(
            this._target.x - this._source.x,
            this._target.y - this._source.y
        )
    }

    moveElement():  void{
        console.log("TARGET Is ",this._target)
        console.log("SOURCE Is ",this._source)
        let delta = this.calculateCoordDelta()
        console.log("DELTAX Is ",delta.x)
        console.log("DELTAY Is ",delta.y)
        this.selectedElement.shiftElement(delta.x  ,delta.y)

    }
}