import {Point} from "./point";
import {Line} from "./line";
import "./drawable";
import {v4 as uuidv4} from 'uuid';

export class Wall implements Drawable {

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
    private _uid: string;

    constructor(
        firstPoint: Point,
        secondPoint: Point,
        height: number,
        reverseTransformationMatrix: number[][],
        uid: string | null
    ) {
        firstPoint = firstPoint.transform(reverseTransformationMatrix);
        secondPoint = secondPoint.transform(reverseTransformationMatrix);
        this._height = height;
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
        this._uid = uid ?? uuidv4();
    }

    get uid(): string {
        return this._uid;
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


    calculateNearestPointDistance(point: Point): { distance: number, nearestPoint: Point } {
        // Calculate nearest point distances for all lines
        const distance1 = this.firstLine.calculateNearestPointDistance(point);
        const distance2 = this.secondLine.calculateNearestPointDistance(point);
        const distance3 = this.thirdLine.calculateNearestPointDistance(point);
        const distance4 = this.fourthLine.calculateNearestPointDistance(point);

        // Build the dictionary with nearest point as key and distance as value
        const distances: { [key: number]: Point } = {};
        distances[distance1.distance] = distance1.nearestPoint ;
        distances[distance2.distance] = distance1.nearestPoint;
        distances[distance3.distance] = distance1.nearestPoint ;
        distances[distance4.distance] = distance1.nearestPoint;


        // Find the minimum distance among all lines
        const minDistance = Math.min(distance1.distance, distance2.distance, distance3.distance, distance4.distance);

        // Find the nearest point using the dictionary
        const nearestPoint = distances[minDistance];

        // Return the minimum distance and its corresponding nearest point
        return {
            distance: minDistance,
            nearestPoint: nearestPoint
        };
    }


    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        wallColor: string,
        transformationMatrix: number[][],
    ) {
        let wall: Wall = this.transform(transformationMatrix);
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(wall.firstPoint.x, wall.firstPoint.y);
        context.lineTo(wall.secondPoint.x, wall.secondPoint.y);
        context.lineTo(wall.thirdPoint.x, wall.thirdPoint.y);
        context.lineTo(wall.fourthPoint.x, wall.fourthPoint.y);
        context.closePath();
        context.fillStyle = wallColor;
        context.strokeStyle = wallColor;
        context.fill();
        context.stroke(); // If you want to keep the border, you can include this line
    }

    transform(transformationMatrix: number[][]): Wall {
        let firstPoint: Point = this._fourthLine.calculateCenter().transform(transformationMatrix);
        let secondPoint: Point = this._secondLine.calculateCenter().transform(transformationMatrix);
        let height: number = this._height * transformationMatrix[0][0];
        return new Wall(firstPoint, secondPoint, height,
            [[1, 1, 0], [1, 1, 0]], this.uid
        );
    }

    updateLines(): void{
        this._yFactor = (this._firstPoint.y -  this._secondPoint.y) >= 0 ? -1 : 1;
        this._xFactor = (this._firstPoint.x - this._secondPoint.x) >= 0 ? -1 : 1;
        this._firstLine = new Line(this._firstPoint, this._secondPoint)
            .calculateParallelLine(this._height / 2, this._xFactor, this._yFactor, -1);
        this._thirdLine = this._firstLine.calculateParallelLine(this._height, this._xFactor, this._yFactor);
        this._thirdPoint = this._thirdLine.secondPoint;
        this._fourthPoint = this._thirdLine.firstPoint;
        this._secondLine = new Line(this._secondPoint, this._thirdPoint);
        this._fourthLine = new Line(this._fourthPoint, this._firstPoint);
        this._width = this._firstLine.calculateDistance();
    }

    shiftElement(x :number , y : number): void{
        this._firstPoint.shiftElement(x,y)
        this._secondPoint.shiftElement(x,y)
        this._thirdPoint.shiftElement(x,y)
        this._fourthPoint.shiftElement(x,y)
        this.updateLines()
    }

}