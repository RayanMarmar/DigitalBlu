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
    private defaultThickness: number = 50;

    constructor(firstPoint: Point, thirdPoint: Point) {
        let xDiff: number = thirdPoint.x - firstPoint.x;
        let yDiff: number = thirdPoint.y - firstPoint.y;
        this._width = Math.abs(xDiff);
        this._height = Math.abs(yDiff);
        this._xFactor = xDiff >= 0 ? 1 : -1;
        this._yFactor = yDiff >= 0 ? 1 : -1;
        this._firstPoint = firstPoint;
        this._thirdPoint = thirdPoint;
        this._secondPoint = new Point(firstPoint.x + (this._width * this.xFactor), firstPoint.y);
        this._fourthPoint = new Point(thirdPoint.x - (this._width * this.xFactor), thirdPoint.y);
        this._firstLine = new Line(firstPoint, this._secondPoint);
        this._secondLine = new Line(this._secondPoint, thirdPoint);
        this._thirdLine = new Line(thirdPoint, this._fourthPoint);
        this._fourthLine = new Line(this._fourthPoint, firstPoint);
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

    // Getter for yFactor
    get yFactor(): number {
        return this._yFactor;
    }

    isLineExtremity(point: Point): boolean {
        return this._firstPoint.equals(point) || this._secondPoint.equals(point)
            || this._thirdPoint.equals(point) || this._fourthPoint.equals(point);
    }

    toString(): string {
        return "{a = " + this._firstPoint.toString() + ", b = " + this._secondPoint.toString()
            + ", c = " + this._thirdPoint.toString() + ", d = " + this._fourthPoint.toString() + "}";
    }
}