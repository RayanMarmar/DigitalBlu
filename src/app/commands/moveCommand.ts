import {Point} from "../drawables/point";
import {MoveService} from "../services/move.service";
import {SnapService} from "../services/snap.service";


export class MoveCommand implements Command{

    constructor(
        private _source : Point,
        private _target : Point,
        private originalCoords : Point,
        private moveService : MoveService,
        private snapService : SnapService
    ) {
    }
    execute(): void {
        let delta = this.moveService.calculateCoordDelta(this._source,this._target)
        this.moveService.moveElement(delta,this.snapService)
    }

    undo(): void {
        let delta = this.moveService.calculateCoordDelta(this._source,this.originalCoords)
        this.moveService.moveElement(delta,this.snapService)
    }

}