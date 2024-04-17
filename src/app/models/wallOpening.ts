import {Line} from "./line";
import {Point} from "./point";
import {Wall} from "./wall";

export class wallOpening {
    protected _wall: Wall;
    protected _parallelLine: Line;
    protected height: number = 50;
    protected _center: Point;
    protected base: Line[];

    constructor(wall: Wall, point: Point) {
        this._wall = wall;
        let line: Line | null = wall.thirdLine.subLine(point, this.height);
        let secondLine: Line | null = wall.firstLine.subLine(point, this.height);
        if (line == null || secondLine == null)
            throw new Error("No sub line found");
        this.base = [line, secondLine];
        this._parallelLine = this.base[0].calculateParallelLine(
            this.height, wall.xFactor, wall.yFactor, 1
        );
        this._center = this.base[0].firstPoint;
    }

    inRange(point: Point): boolean {
        return this._wall.containsPoint(point)
    }

    // Getter for line
    get line(): Line {
        return this.base[0];
    }

    // Setter for line
    set line(value: Line) {
        this.base[0] = value;
    }

    get center(): Point {
        return this._center;
    }

    set center(value: Point) {
        this._center = value;
    }

    get parallelLine(): Line {
        return this._parallelLine;
    }

    set parallelLine(value: Line) {
        this._parallelLine = value;
    }

    protected drawOpening(context: CanvasRenderingContext2D, bgColor: string, wallColor: string) {
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(this.base[0].firstPoint.x, this.base[0].firstPoint.y);
        context.lineTo(this.base[0].secondPoint.x, this.base[0].secondPoint.y);
        context.lineTo(this.base[1].secondPoint.x, this.base[1].secondPoint.y);
        context.lineTo(this.base[1].firstPoint.x, this.base[1].firstPoint.y);
        context.closePath();
        context.fillStyle = bgColor;
        context.fill();
        context.strokeStyle = bgColor;
        context.stroke(); // If you want to keep the border, you can include this line
        context.fillStyle = wallColor;
        context.strokeStyle = wallColor;
    }
}