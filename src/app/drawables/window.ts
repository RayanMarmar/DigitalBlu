import {Point} from "./point";
import {Wall} from "./wall";
import {WallOpening} from "./wallOpening";
import "./drawable";
import {Line} from "./line";

export class Window extends WallOpening implements Drawable {
    constructor(wall: Wall, point: Point, height: number = 50) {
        super(wall, point, height);
    }

    override toString(): string {
        return "window : {firstLine : " + this._base[0].toString() + " secondLine : " + this._base[1].toString() + "}";
    }

    draw(context: CanvasRenderingContext2D, bgColor: string, wallColor: string, transformationMatrix: number[][]): void {
        let window: Window = this.transform(transformationMatrix);
        window.drawOpening(context, bgColor, wallColor);
    }


    transform(transformationMatrix: number[][]): Window {
        return new Window(
            this._wall.transform(transformationMatrix),
            this._base[0].calculateCenter().transform(transformationMatrix),
            this.height * transformationMatrix[0][0],
        );
    }

    updateLines() : void {
        this._parallelLine = this._base[0].calculateParallelLine(
            this._height, this.wall.xFactor, this.wall.yFactor, 1
        );
        this._center = this._base[0].firstPoint;
    }

}