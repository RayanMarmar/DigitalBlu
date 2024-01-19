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

    calculateParallelLine(height: number, xFactor: number, yFactor: number, direction: number = 1): Line {
        const originalSlope: number = (this._secondPoint.y - this._firstPoint.y) / (this._secondPoint.x - this._firstPoint.x);

        if (originalSlope == 0) {
            return new Line(
                new Point(this._firstPoint.x, this._firstPoint.y + direction * height),
                new Point(this._secondPoint.x, this._secondPoint.y + direction * height)
            );
        }
        const perpendicularSlope: number = -1 / originalSlope;

        const offsetX: number = direction * Math.abs(height / Math.sqrt(1 + Math.pow(perpendicularSlope, 2)));
        const offsetY: number = direction * Math.abs(offsetX * perpendicularSlope);

        return new Line(
            new Point(this._firstPoint.x + offsetX * yFactor * -1, this._firstPoint.y + offsetY * xFactor),
            new Point(this._secondPoint.x + offsetX * yFactor * -1, this._secondPoint.y + offsetY * xFactor)
        );
    }

    calculateDistance(): number {
        return Math.sqrt(
            Math.pow(this._firstPoint.x - this._secondPoint.x, 2)
            + Math.pow(this._firstPoint.y - this._secondPoint.y, 2)
        );
    }
}