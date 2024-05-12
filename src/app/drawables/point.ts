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

    projectCursorToAngleVector(angle: number, cursorPosition: Point): Point {
        // Calculate the unit vector in the direction of the snapped angle
        const snappedVector: [number, number] = [
            Math.cos(angle),
            Math.sin(angle),
        ];

        // Calculate the vector from the starting point to the current cursor position
        const cursorVector: [number, number] = [
            cursorPosition.x - this._x,
            cursorPosition.y - this._y,
        ];

        // Calculate the dot product of the cursor vector and the snapped vector
        const dotProduct = cursorVector[0] * snappedVector[0] + cursorVector[1] * snappedVector[1];

        // Calculate the projection of the cursor vector onto the snapped vector
        const projectedVector: [number, number] = [
            dotProduct * snappedVector[0],
            dotProduct * snappedVector[1],
        ];

        // Calculate the projected position in world coordinates
        return new Point(
            this._x + projectedVector[0],
            this._y + projectedVector[1],
        );
    }

    // Serialize Point to a string representation
    serialize(): string {
        return `${this._x},${this._y}`;
    }

    // Deserialize a string representation to create a Point instance
    static deserialize(serializedPoint: string): Point {
        const [x, y] = serializedPoint.split(',').map(Number);
        return new Point(x, y);
    }
}