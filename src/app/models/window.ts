import {Point} from "./point";
import {Wall} from "./wall";
import {wallOpening} from "./wallOpening";

export class Window extends wallOpening {
    constructor(wall: Wall, point: Point) {
        super(wall, point);
    }

    override toString(): string {
        return "window : {firstLine : " + this.base[0].toString() + " secondLine : " + this.base[1].toString() + "}";
    }

    draw(context: CanvasRenderingContext2D, bgColor: string, wallColor: string): void {
        this.drawOpening(context, bgColor, wallColor);
    }
}