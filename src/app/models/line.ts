import {Point} from "./point";

export class Line {
    private _firstPoint: Point;
    private _secondPoint: Point;

    constructor(firstPoint: Point, secondPoint: Point) {
        this._firstPoint = firstPoint;
        this._secondPoint = secondPoint;
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

    isLineExtremity(point: Point): boolean {
        return this._firstPoint.equals(point) || this._secondPoint.equals(point);
    }

    toString(): string {
        return "{a = " + this._firstPoint.toString() + ", b = " + this._secondPoint.toString() + "}";
    }
}