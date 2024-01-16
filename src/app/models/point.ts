export class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    // Getter for x coordinate
    get x(): number {
        return this._x;
    }

    // Setter for x coordinate
    set x(value: number) {
        this._x = value;
    }

    // Getter for y coordinate
    get y(): number {
        return this._y;
    }

    // Setter for y coordinate
    set y(value: number) {
        this._y = value;
    }

    equals(point: Point): boolean {
        return point.x == this._x && point.y == this._y;
    }

    toString(): string {
        return "(x = " + this._x + ", y = " + this._y + ")";
    }
}