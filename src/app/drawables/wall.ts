import {Point} from "./point";
import {Line} from "./line";
import "./drawable";
import {v4 as uuidv4} from 'uuid';
import {WallOpening} from "./wallOpening";

export class Wall implements Drawable {
    private readonly _firstLine: Line;
    private readonly _secondLine: Line;
    private readonly _thirdLine: Line;
    private readonly _fourthLine: Line;
    private readonly _width: number;
    private readonly _height: number;
    private readonly _xFactor: number;
    private readonly _yFactor: number;
    private readonly _uid: string;
    private range: number = 10;
    private _wallOpenings: WallOpening[] = [];

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
        this._yFactor = (firstPoint.y - secondPoint.y) > 0 ? -1 : 1;
        this._xFactor = (firstPoint.x - secondPoint.x) > 0 ? -1 : 1;

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

    get wallOpenings(): WallOpening[] {
        return this._wallOpenings;
    }

    get uid(): string {
        return this._uid;
    }

    // Getter for firstLine
    get firstLine(): Line {
        return this._firstLine;
    }

    // Getter for secondLine
    get secondLine(): Line {
        return this._secondLine;
    }

    // Getter for thirdLine
    get thirdLine(): Line {
        return this._thirdLine;
    }

    // Getter for fourthLine
    get fourthLine(): Line {
        return this._fourthLine;
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

    addWallOpening(wallOpening: WallOpening): void {
        this.wallOpenings.push(wallOpening);
    }

    removeWallOpening(wallOpening: WallOpening): void {
        let index: number = this._wallOpenings.indexOf(wallOpening);
        this._wallOpenings = this._wallOpenings.splice(index, 1);
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

    transform(transformationMatrix: number[][]): Wall {
        let firstPoint: Point = this._fourthLine.calculateCenter().transform(transformationMatrix);
        let secondPoint: Point = this._secondLine.calculateCenter().transform(transformationMatrix);
        let height: number = this._height * transformationMatrix[0][0];
        return new Wall(firstPoint, secondPoint, height,
            [[1, 1, 0], [1, 1, 0]], this.uid
        );
    }

    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        wallColor: string,
        transformationMatrix: number[][],
    ): void {
        // Get the updated wall coordinates
        let wall: Wall = this.transform(transformationMatrix);

        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(wall._firstLine.firstPoint.x, wall._firstLine.firstPoint.y);
        context.lineTo(wall._firstLine.secondPoint.x, wall._firstLine.secondPoint.y);
        context.lineTo(wall._thirdLine.secondPoint.x, wall._thirdLine.secondPoint.y);
        context.lineTo(wall._thirdLine.firstPoint.x, wall._thirdLine.firstPoint.y);
        context.closePath();
        context.fillStyle = wallColor;
        context.fill();
        context.stroke(); // If you want to keep the border, you can include this line
        let displayLine =  this.xFactor == 1 ? wall._thirdLine : wall._firstLine ;
        this.firstLine.displayDimensions(
            context,
            displayLine,
            wallColor,
        );
    }

    equals(drawable: Drawable): boolean {
        return drawable instanceof Wall
            && this._firstLine.equals(drawable.firstLine)
            && this._secondLine.equals(drawable.secondLine)
            && this._thirdLine.equals(drawable.thirdLine)
            && this._fourthLine.equals(drawable.fourthLine);
    }
}