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
}