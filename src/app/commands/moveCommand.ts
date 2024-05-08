import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";

export class MoveCommand implements Command{

    private delta : Point | undefined

    constructor(
        private selectedElement: Drawable,
        private _source : Point,
        private _target : Point,
        private _windowsList : Window[],
        private _doorsList : Door[],
        private linkedElementsList: Drawable[],
        private originalCoords : Point
    ) {
    }
    execute(): void {
        let delta = this.calculateCoordDelta(this._source,this._target)
        this.moveElement(delta)
    }

    undo(): void {
        let delta = this.calculateCoordDelta(this._source,this.originalCoords)
        this.moveElement(delta)
    }
    calculateCoordDelta(source : Point, target: Point):Point{
        return new Point(
            target.x - source.x,
            target.y - source.y
        )
    }

    moveOpenings(wall : Wall,delta : Point){
        for (let i = 0; i < this._windowsList.length; i++) {
            const window = this._windowsList[i];

            // Check if the wall of the window is equal to the selected wall
            if (window.wall === wall) {
                window.shiftElement(delta.x,delta.y)
            }
        }

        // Iterate over the door list
        for (let i = 0; i < this._doorsList.length; i++) {
            const door = this._doorsList[i];

            // Check if the wall of the door is equal to the selected wall
            if (door.wall === wall) {
                door.shiftElement(delta.x,delta.y)
            }
        }
    }



    moveLinkedElements(delta : Point): void{
        if(this.linkedElementsList !== null){
            for (let i: number = 0; i < this.linkedElementsList.length; i++) {
                this.linkedElementsList[i].shiftElement(delta.x,delta.y)
            }
        }
    }

    moveElement(delta : Point):  void{

        this.selectedElement.shiftElement(delta.x  ,delta.y)
        if (this.selectedElement instanceof Wall){

            this.moveOpenings(
                this.selectedElement,
                delta,
            )
        }
        this.moveLinkedElements(delta)
    }
}