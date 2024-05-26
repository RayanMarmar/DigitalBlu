import {Line} from "./line";
import {Point} from "./point";
import {Wall} from "./wall";

export abstract class WallOpening implements Drawable {
    protected _wall: Wall;
    protected _width: number;
    protected _base: Line[];


    constructor(wall: Wall, point: Point, width: number) {
        this._width = width;
        this._wall = wall;
        let line: Line | null = wall.thirdLine.subLine(point, this._width);
        let secondLine: Line | null = wall.firstLine.subLine(point, this._width);

        if (line == null || secondLine == null)
            throw new Error("No sub line found");

        this._base = [line, secondLine];
    }

    abstract draw(context: CanvasRenderingContext2D, canvasColor: string, drawableColor: string, conversionFactor: number, transformationMatrix: number[][]): void ;

    abstract toString(): String ;

    abstract equals(drawable: Drawable): boolean ;

    abstract shiftExtremity(extremity: Drawable, x: number, y: number): void ;

    abstract transform(transformationMatrix: number[][]): WallOpening;

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get wall(): Wall {
        return this._wall;
    }

    get base(): Line[] {
        return this._base;
    }

    calculateNearestPointDistance(point: Point): number {
        return Math.min(
            this.base[0].calculateNearestPointDistance(point),
            this.base[1].calculateNearestPointDistance(point)
        );
    }

    protected drawOpening(context: CanvasRenderingContext2D, canvasColor: string): void {
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(this._base[0].firstPoint.x, this._base[0].firstPoint.y);
        context.lineTo(this._base[0].secondPoint.x, this._base[0].secondPoint.y);
        context.lineTo(this._base[1].secondPoint.x, this._base[1].secondPoint.y);
        context.lineTo(this._base[1].firstPoint.x, this._base[1].firstPoint.y);
        context.closePath();
        context.fillStyle = canvasColor;
        context.strokeStyle = canvasColor;
        context.fill();
        context.stroke();
        context.restore();
    }

    shiftElement(x: number, y: number): void {
        let point = this._base[0].calculateCenter();
        point.shiftElement(x, y)
        let line: Line | null = this.wall.thirdLine.subLine(point, this._width);
        let secondLine: Line | null = this.wall.firstLine.subLine(point, this._width);
        if (line == null || secondLine == null)
            return;
        this._base = [line, secondLine];
    }
}