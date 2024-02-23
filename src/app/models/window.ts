import {Point} from "./point";
import {Wall} from "./wall";
import {WallOpening} from "./wallOpening";

export class Window extends WallOpening {
    constructor(wall: Wall, point: Point, height: number = 50) {
        super(wall, point, height);
    }

    override toString(): string {
        return "window : {firstLine : " + this._base[0].toString() + " secondLine : " + this._base[1].toString() + "}";
    }

    draw(context: CanvasRenderingContext2D, transformationMatrix: number[][]): void {
        let window: Window = this.transform(transformationMatrix);
        window.drawOpening(context);
    }


    transform(transformationMatrix: number[][]): Window {
        return new Window(
            this._wall.transform(transformationMatrix),
            this._base[0].calculateCenter().transform(transformationMatrix),
            this.height * transformationMatrix[0][0],
        );
    }
}