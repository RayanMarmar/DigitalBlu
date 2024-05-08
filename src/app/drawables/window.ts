import {Point} from "./point";
import {Wall} from "./wall";
import {WallOpening} from "./wallOpening";
import "./drawable";

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

    shiftElement(x :number , y : number): void{
        this.base[0].firstPoint.x += x
        this.base[0].firstPoint.y += y
        this.base[0].secondPoint.x += x
        this.base[0].secondPoint.y += y

        this.base[1].firstPoint.x += x
        this.base[1].firstPoint.y += y
        this.base[1].secondPoint.x += x
        this.base[1].secondPoint.y += y
    }
}