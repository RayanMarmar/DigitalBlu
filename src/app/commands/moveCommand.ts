import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {Window} from "../drawables/window";
import {Door} from "../drawables/door";


export class MoveCommand implements Command{

    constructor(
        private selectedElement: Drawable,
        private _source : Point,
        private _target : Point,
        private _windowsList : Window[],
        private _doorsList : Door[],
        private _linkedElementsList: Drawable[],
        private _linkedPointsList : Point[],
        private originalCoords : Point,

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


    stretchLinkedElements(delta: Point) : void{
        if(this._linkedPointsList !== null){
            for (let i: number = 0; i < this._linkedPointsList.length; i++) {
                this._linkedPointsList[i].shiftElement(delta.x,delta.y)
            }
            this.removeOpenings()


        }
    }

    removeOpenings(){
        for (let i: number = 0; i < this._linkedElementsList.length; i++) {
            if(this._linkedElementsList[i] instanceof Wall){
                let wall = this._linkedElementsList[i] as Wall
                wall.updateLines()
                for (let i: number = 0; i < this._doorsList.length; i++) {
                    if(this._doorsList[i] instanceof Door && this._doorsList[i].wall === wall){
                        let door = this._doorsList[i] as Door
                        if(door.shouldRemove()){
                            this._doorsList.splice(i, 1);
                        }
                    }
                }
                for (let i: number = 0; i < this._windowsList.length; i++) {
                    if(this._windowsList[i] instanceof Door && this._doorsList[i].wall === wall){
                        let window = this._windowsList[i] as Window
                        if (window.shouldRemove()){
                            this._windowsList.splice(i, 1);
                        }

                    }
                }
            }

        }
    }


    moveLinkedElements(delta : Point): void{
        if(this._linkedElementsList !== null){
            for (let i: number = 0; i < this._linkedElementsList.length; i++) {
                this._linkedElementsList[i].shiftElement(delta.x,delta.y)
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
        this.stretchLinkedElements(delta)
        //this.moveLinkedElements(delta)
    }
}