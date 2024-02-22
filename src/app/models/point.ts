export class Point {
    private _x: number;
    private _y: number;
    private range: number = 5;

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

    inPointRange(point: Point): boolean {
        return this.inXRange(point.x) && this.inyRange(point.y);
    }

    private inXRange(x: number): boolean {
        return this._x - this.range <= x && this._x + this.range >= x;
    }

    private inyRange(y: number): boolean {
        return this._y - this.range <= y && this._y + this.range >= y;
    }

    // Method to scale a vec2
    scale(scale: number): Point {
        return new Point(this.x * scale, this.y * scale);
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillRect(this._x, this._y, 1, 1);
    }
}