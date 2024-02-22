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

    draw(context: CanvasRenderingContext2D): void {
        this.drawOpening(context);
    }
}