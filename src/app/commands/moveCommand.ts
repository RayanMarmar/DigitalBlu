import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";

export class MoveCommand implements Command{


    constructor(
        private selectedElement: Drawable,
        private _source : Point,
        private _target : Point
    ) {
    }
    execute(): void {
        this.moveElement()
    }

    undo(): void {

    }
    calculateCoordDelta():Point{
        console.log("calculating",this._target.x - this._source.x,this._target.y- this._source.y)
        return new Point(
            this._target.x - this._source.x,
            this._target.y- this._source.y
        )
    }

    moveElement(): void{
        let delta = this.calculateCoordDelta()
        if ( this.selectedElement instanceof Line){
           let drawable = this.selectedElement as Line ;
            drawable.shiftElement(delta.x  ,delta.y)

        }

    }
}