import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {MoveService} from "../services/move.service";


export class MoveCommand implements Command{

    constructor(
        private _source : Point,
        private _target : Point,
        private originalCoords : Point,
        private moveService : MoveService

    ) {
    }
    execute(): void {
        let delta = this.moveService.calculateCoordDelta(this._source,this._target)
        this.moveService.moveElement(delta)
    }

    undo(): void {
        let delta = this.moveService.calculateCoordDelta(this._source,this.originalCoords)
        this.moveService.moveElement(delta)
    }

}