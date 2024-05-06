import "./drawable";

export class Point implements Drawable {
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
    transform(transformationMatrix: number[][]): Point {
        return new Point(
            this.x * transformationMatrix[0][0] + transformationMatrix[0][2],
            this.y * transformationMatrix[1][1] + transformationMatrix[1][2]
        );
    }

    draw(context: CanvasRenderingContext2D,
         canvasColor: string,
         drawableColor: string,
         transformationMatrix: number[][] = [[1, 0, 0], [0, 1, 0]]): void {
        context.fillRect(this._x, this._y, 1, 1);
    }

    getAngleWithXVector(): number {
        return 0;
    }
}