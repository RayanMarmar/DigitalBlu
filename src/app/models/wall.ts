import {Point} from "./point";
import {Line} from "./line";

export class Wall {
    private _firstPoint: Point;
    private _secondPoint: Point;
    private _thirdPoint: Point;
    private _fourthPoint: Point;
    private _firstLine: Line;
    private _secondLine: Line;
    private _thirdLine: Line;
    private _fourthLine: Line;
    private _width: number;
    private _height: number;
    private _xFactor: number;
    private _yFactor: number;
    private defaultThickness: number = 20;

    constructor(firstPoint: Point, secondPoint: Point) {
        this._height = this.defaultThickness;
        this._yFactor = (firstPoint.y - secondPoint.y) >= 0 ? -1 : 1;
        this._xFactor = (firstPoint.x - secondPoint.x) >= 0 ? -1 : 1;
        this._firstLine = new Line(firstPoint, secondPoint)
            .calculateParallelLine(this._height / 2, this._xFactor, this._yFactor, -1);
        this._thirdLine = this._firstLine.calculateParallelLine(this._height, this._xFactor, this._yFactor);
        this._firstPoint = this._firstLine.firstPoint;
        this._secondPoint = this._firstLine.secondPoint;
        this._thirdPoint = this._thirdLine.secondPoint;
        this._fourthPoint = this._thirdLine.firstPoint;
        this._secondLine = new Line(this._secondPoint, this._thirdPoint);
        this._fourthLine = new Line(this._fourthPoint, this._firstPoint);
        this._width = this._firstLine.calculateDistance();
    }

    // Getter for firstPoint
    get firstPoint(): Point {
        return this._firstPoint;
    }

    // Setter for firstPoint
    set firstPoint(value: Point) {
        this._firstPoint = value;
    }

    // Getter for secondPoint
    get secondPoint(): Point {
        return this._secondPoint;
    }

    // Setter for secondPoint
    set secondPoint(value: Point) {
        this._secondPoint = value;
    }

    // Getter for thirdPoint
    get thirdPoint(): Point {
        return this._thirdPoint;
    }

    // Setter for thirdPoint
    set thirdPoint(value: Point) {
        this._thirdPoint = value;
    }

    // Getter for fourthPoint
    get fourthPoint(): Point {
        return this._fourthPoint;
    }

    // Setter for fourthPoint
    set fourthPoint(value: Point) {
        this._fourthPoint = value;
    }

    // Getter for firstLine
    get firstLine(): Line {
        return this._firstLine;
    }

    // Setter for firstLine
    set firstLine(value: Line) {
        this._firstLine = value;
    }

    // Getter for secondLine
    get secondLine(): Line {
        return this._secondLine;
    }

    // Setter for secondLine
    set secondLine(value: Line) {
        this._secondLine = value;
    }

    // Getter for thirdLine
    get thirdLine(): Line {
        return this._thirdLine;
    }

    // Setter for thirdLine
    set thirdLine(value: Line) {
        this._thirdLine = value;
    }

    // Getter for fourthLine
    get fourthLine(): Line {
        return this._fourthLine;
    }

    // Setter for fourthLine
    set fourthLine(value: Line) {
        this._fourthLine = value;
    }

    // Getter for width
    get width(): number {
        return this._width;
    }

    // Getter for width
    get height(): number {
        return this._height;
    }

    // Getter for xFactor
    get xFactor(): number {
        return this._xFactor;
    }

    get yFactor(): number {
        return this._yFactor;
    }

    set yFactor(value: number) {
        this._yFactor = value;
    }

    isLineExtremity(point: Point): boolean {
        return this._firstPoint.equals(point) || this._secondPoint.equals(point)
            || this._thirdPoint.equals(point) || this._fourthPoint.equals(point);
    }

    toString(): string {
        return "{a = " + this._firstPoint.toString() + ", b = " + this._secondPoint.toString()
            + ", c = " + this._thirdPoint.toString() + ", d = " + this._fourthPoint.toString() + "}";
    }

    containsPoint(point: Point): boolean {
        const x = point.x;
        const y = point.y;

        // Check if the point is inside the polygon formed by the wall's vertices
        // Using the winding number algorithm
        const windingNumber = this.calculateWindingNumber(x, y);

        // If the winding number is non-zero, the point is inside the polygon
        return windingNumber !== 0;
    }

    private calculateWindingNumber(x: number, y: number): number {
        // Calculate the winding number using the vertices of the wall
        let windingNumber = 0;

        windingNumber += this.calculateWindingNumberForEdge(this._firstPoint, this._secondPoint, x, y);
        windingNumber += this.calculateWindingNumberForEdge(this._secondPoint, this._thirdPoint, x, y);
        windingNumber += this.calculateWindingNumberForEdge(this._thirdPoint, this._fourthPoint, x, y);
        windingNumber += this.calculateWindingNumberForEdge(this._fourthPoint, this._firstPoint, x, y);

        return windingNumber;
    }

    private calculateWindingNumberForEdge(start: Point, end: Point, x: number, y: number): number {
        // Calculate the winding number for a given edge and point
        if (start.y <= y) {
            if (end.y > y && this.isLeft(start, end, x, y) > 0) {
                return 1;
            }
        } else if (end.y <= y && this.isLeft(start, end, x, y) < 0) {
            return -1;
        }

        return 0;
    }

    private isLeft(start: Point, end: Point, x: number, y: number): number {
        // Helper function to determine if a point is to the left of an edge
        return ((end.x - start.x) * (y - start.y)) - ((x - start.x) * (end.y - start.y));
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(this._firstPoint.x, this._firstPoint.y);
        context.lineTo(this._secondPoint.x, this._secondPoint.y);
        context.lineTo(this._thirdPoint.x, this._thirdPoint.y);
        context.lineTo(this._fourthPoint.x, this._fourthPoint.y);
        context.closePath();
        context.fill();
        context.stroke(); // If you want to keep the border, you can include this line
    }
}