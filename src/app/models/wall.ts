import {Point} from "./point";
import {Line} from "./line";

export class Wall {
    private _firstPoint: Point;
    private _secondPoint: Point;
    private _thirdPoint: Point = new Point(0, 0);
    private _fourthPoint: Point = new Point(0, 0);
    private _firstLine: Line;
    private _secondLine: Line;
    private _thirdLine: Line;
    private _fourthLine: Line;
    private _width: number;
    private _height: number;
    private _xFactor: number;
    private defaultThickness: number = 50;

    constructor(firstPoint: Point, secondPoint: Point) {
        this._xFactor = (secondPoint.x - firstPoint.x) >= 0 ? 1 : -1;
        this._width = this.calculateDistance(firstPoint, secondPoint);
        this._height = this.defaultThickness;
        this._firstPoint = this._xFactor >= 0 ? firstPoint : secondPoint;
        this._secondPoint = this._xFactor >= 0 ? secondPoint : firstPoint;
        this.calculateRectangleCoordinates();
        this._firstLine = new Line(this._firstPoint, this._secondPoint);
        this._secondLine = new Line(this._secondPoint, this._thirdPoint);
        this._thirdLine = new Line(this._thirdPoint, this._fourthPoint);
        this._fourthLine = new Line(this._fourthPoint, this._firstPoint);
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

    calculateRectangleCoordinates(): void {
        const originalSlope: number = (this._secondPoint.y - this._firstPoint.y) / (this._secondPoint.x - this._firstPoint.x);

        const perpendicularSlope: number = -1 / originalSlope;

        const offsetX: number = this._height / Math.sqrt(1 + Math.pow(perpendicularSlope, 2));
        const offsetY: number = offsetX * perpendicularSlope;

        this._fourthPoint = new Point(this._firstPoint.x + offsetX, this._firstPoint.y + offsetY);
        this._thirdPoint = new Point(this._secondPoint.x + offsetX, this._secondPoint.y + offsetY);
    }

    calculateDistance(a: Point, b: Point): number {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
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