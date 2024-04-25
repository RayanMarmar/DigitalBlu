import {Point} from "./point";
import {Line} from "./line";

//This class is used to generate a clickable hitbox around a drawable element
export class HitBox implements Drawable {

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
    private _transformationMatrix: number[][];

    // the constructor arguments should be the same as the element arguments
    constructor(firstPoint: Point, secondPoint: Point, height: number, reverseTransformationMatrix: number[][]) {
// Calculate the extension factors to make the hitbox slightly larger
        const extensionFactorX = 1.01; // Adjust these factors as needed
        const extensionFactorY = 1.1;

        // Calculate the dimensions of the hitbox
        const deltaX = (firstPoint.x - secondPoint.x) * extensionFactorX;
        let line = new Line(firstPoint, secondPoint)
        firstPoint = firstPoint.transform(reverseTransformationMatrix);
        secondPoint = secondPoint.transform(reverseTransformationMatrix);


        firstPoint.x = firstPoint.x - deltaX;
        secondPoint.x = secondPoint.x + deltaX;


        this._height = height;
        this._yFactor = (firstPoint.y - secondPoint.y) >= 0 ? -1 : 1;
        this._xFactor = (firstPoint.x - secondPoint.x) >= 0 ? -1 : 1;

        this._firstLine = new Line(firstPoint, secondPoint)
            .calculateParallelLine(this._height, this._xFactor, this._yFactor, -1);
        this._width = this._firstLine.calculateDistance();
        this._thirdLine = this._firstLine.calculateParallelLine(-2 * this._height, this._xFactor, this._yFactor);
        this._firstPoint = this._firstLine.firstPoint;
        this._secondPoint = this._firstLine.secondPoint;
        this._thirdPoint = this._thirdLine.secondPoint;
        this._fourthPoint = this._thirdLine.firstPoint;
        this._secondLine = new Line(this._secondPoint, this._thirdPoint);
        this._fourthLine = new Line(this._fourthPoint, this._firstPoint);
        this._transformationMatrix = reverseTransformationMatrix;

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


    get transformationMatrix(): number[][] {
        return this._transformationMatrix;
    }

    set transformationMatrix(value: number[][]) {
        this._transformationMatrix = value;
    }

    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        wallColor: string,
    ) {
        let hitBox: HitBox = this.transform(this._transformationMatrix);
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(hitBox.firstPoint.x, hitBox.firstPoint.y);
        context.lineTo(hitBox.secondPoint.x, hitBox.secondPoint.y);
        context.lineTo(hitBox.thirdPoint.x, hitBox.thirdPoint.y);
        context.lineTo(hitBox.fourthPoint.x, hitBox.fourthPoint.y);
        context.closePath();
        context.fillStyle = "#ff5733";
        context.strokeStyle = "#ff5733";
        // context.fill();
        context.stroke(); // If you want to keep the border, you can include this line
    }

    transform(transformationMatrix: number[][]): HitBox {
        let firstPoint: Point = this._fourthLine.calculateCenter().transform(transformationMatrix);
        let secondPoint: Point = this._secondLine.calculateCenter().transform(transformationMatrix);
        let height: number = this._height * transformationMatrix[0][0];
        return new HitBox(firstPoint, secondPoint, height, [[1, 1, 0], [1, 1, 0]]);
    }
}