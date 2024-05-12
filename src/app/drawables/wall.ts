import {Point} from "./point";
import {Line} from "./line";
import "./drawable";
import {v4 as uuidv4} from 'uuid';

export class Wall implements Drawable {

    private _firstLine: Line;
    private _secondLine: Line;
    private _thirdLine: Line;
    private _fourthLine: Line;
    private _width: number;
    private _height: number;
    private _xFactor: number;
    private _yFactor: number;
    private _uid: string;
    private range: number = 10;

    constructor(
        firstPoint: Point,
        secondPoint: Point,
        height: number,
        reverseTransformationMatrix: number[][],
        uid: string | null
    ) {
        // Get the original point coordinates in case of a certain transformation
        firstPoint = firstPoint.transform(reverseTransformationMatrix);
        secondPoint = secondPoint.transform(reverseTransformationMatrix);

        // Initialize variables
        this._height = height;
        this._yFactor = (firstPoint.y - secondPoint.y) >= 0 ? -1 : 1;
        this._xFactor = (firstPoint.x - secondPoint.x) >= 0 ? -1 : 1;

        // Calculate wall lines
        this._firstLine = new Line(firstPoint, secondPoint)
            .calculateParallelLine(this._height / 2, this._xFactor, this._yFactor, -1);
        this._thirdLine = this._firstLine.calculateParallelLine(this._height, this._xFactor, this._yFactor);
        this._secondLine = new Line(this._firstLine.secondPoint, this._thirdLine.secondPoint);
        this._fourthLine = new Line(this._thirdLine.firstPoint, this._firstLine.firstPoint);

        // Get wall width
        this._width = this._firstLine.calculateDistance();
        // Initialize new UID for new walls
        this._uid = uid ?? uuidv4();
    }

    get uid(): string {
        return this._uid;
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

    toString(): string {
        return "{a = " + this._firstLine.firstPoint.toString() + ", b = " + this._firstLine.secondPoint.toString()
            + ", c = " + this._thirdLine.secondPoint.toString() + ", d = " + this._thirdLine.firstPoint.toString() + "}";
    }

    containsPoint(point: Point): boolean {
        return this.calculateNearestPointDistance(point) < this.range;
    }

    calculateNearestPointDistance(point: Point): number {

        return Math.min(this.firstLine.calculateNearestPointDistance(point),
            this.secondLine.calculateNearestPointDistance(point),
            this.thirdLine.calculateNearestPointDistance(point),
            this.fourthLine.calculateNearestPointDistance(point));
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
        context.moveTo(wall._firstLine.firstPoint.x, wall._firstLine.firstPoint.y);
        context.lineTo(wall._firstLine.secondPoint.x, wall._firstLine.secondPoint.y);
        context.lineTo(wall._thirdLine.secondPoint.x, wall._thirdLine.secondPoint.y);
        context.lineTo(wall._thirdLine.firstPoint.x, wall._thirdLine.firstPoint.y);
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
}