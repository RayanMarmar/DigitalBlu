import {Point} from "./point";
import {Wall} from "./wall";
import {WallOpening} from "./wallOpening";
import "./drawable";

export class Window extends WallOpening {
    constructor(wall: Wall, point: Point, width: number = 50) {
        super(wall, point, width);
    }

    override toString(): string {
        return "window : {firstLine : " + this._base[0].toString() + " secondLine : " + this._base[1].toString() + "}";
    }

    draw(
        context: CanvasRenderingContext2D,
        bgColor: string,
        wallColor: string,
        conversionFactor: number,
        displayDimensions: boolean,
        transformationMatrix: number[][],
    ): void {
        try {
            let window: Window = this.transform(transformationMatrix);
            window.drawOpening(context, bgColor);
        } catch (e) {
        }
    }


    transform(transformationMatrix: number[][]): Window {
        return new Window(
            this._wall.transform(transformationMatrix),
            this._base[0].calculateCenter().transform(transformationMatrix),
            this.width * transformationMatrix[0][0],
        );
    }

    shiftExtremity(extremity: Point, x: number, y: number): void {
    }

    equals(drawable: Drawable): boolean {
        return drawable instanceof Window
            && this._wall.equals(drawable.wall)
            && this._width == drawable.width
            && this._base[0].equals(drawable._base[0])
            && this._base[1].equals(drawable._base[1]);
    }
}