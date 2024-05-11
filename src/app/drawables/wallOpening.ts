import {Line} from "./line";
import {Point} from "./point";
import {Wall} from "./wall";
import {min} from "rxjs";

export class WallOpening {
    protected _wall: Wall;
    protected _parallelLine: Line;
    protected _height: number;
    protected _center: Point;
    protected _base: Line[];
    protected _minDistance = 50


    constructor(wall: Wall, point: Point, height: number) {

        this._height = height;
        this._wall = wall;
        let line: Line | null = wall.thirdLine.subLine(point, this._height);
        let secondLine: Line | null = wall.firstLine.subLine(point, this._height);


        if (line == null || secondLine == null)
            throw new Error("No sub line found");
        this._base = [line, secondLine];
        this._parallelLine = this._base[0].calculateParallelLine(
            this._height, wall.xFactor, wall.yFactor, 1
        );
        this._center = this._base[0].firstPoint;

    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    inRange(point: Point): boolean {
        return this._wall.containsPoint(point)
    }

    // Getter for line
    get line(): Line {
        return this._base[0];
    }

    // Setter for line
    set line(value: Line) {
        this._base[0] = value;
    }

    get center(): Point {
        return this._center;
    }

    set center(value: Point) {
        this._center = value;
    }

    get parallelLine(): Line {
        return this._parallelLine;
    }

    set parallelLine(value: Line) {
        this._parallelLine = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get wall(): Wall {
        return this._wall;
    }

    set wall(value: Wall) {
        this._wall = value;
    }

    get base(): Line[] {
        return this._base;
    }
    shouldRemove() : boolean{
       return this.calculateNearestPointDistanceToWall() < this._minDistance;
    }

    calculateNearestPointDistanceToWall(): number {
        let line1 = new Line(
            this.base[0].calculateCenter(),
            this.wall.firstPoint
        )
        let line2 = new Line(
            this.base[0].calculateCenter(),
            this.wall.secondPoint
        )
        let line3 = new Line(
            this.parallelLine.calculateCenter(),
            this.wall.firstPoint
        )
        let line4 = new Line(
            this.parallelLine.calculateCenter(),
            this.wall.secondPoint
        )
        let line5 = new Line(
            this.parallelLine.calculateCenter(),
            this.wall.thirdPoint
        )
        let line6 = new Line(
            this.parallelLine.calculateCenter(),
            this.wall.fourthPoint
        )

        console.log("Min distance is " , line1.calculateDistance() , line2.calculateDistance(),line3.calculateDistance(),line4.calculateDistance()
        ,line5.calculateDistance(),line6.calculateDistance())
        return Math.min(line1.calculateDistance(),line2.calculateDistance(),line3.calculateDistance(),line4.calculateDistance(),line5.calculateDistance(),line6.calculateDistance())


    }
    calculateNearestPointDistance(point: Point): {distance : number,
        point : Point} {

        const { distance: distance1, nearestPoint: point1 } = this.base[0].calculateNearestPointDistance(point);
        const { distance: distance2, nearestPoint: point2 } = this.base[1].calculateNearestPointDistance(point);

        let minDistance = Math.min(distance1, distance2);

        // Return the result object with the minimum distance and its corresponding nearest point
        return {
            distance: minDistance,
            point: minDistance === distance1 ? point1 : point2 // Choose the nearest point with the minimum distance
        }
    }

    set base(value: Line[]) {
        this._base = value;
    }

    protected drawOpening(context: CanvasRenderingContext2D, bgColor: string, wallColor: string) {
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(this._base[0].firstPoint.x, this._base[0].firstPoint.y);
        context.lineTo(this._base[0].secondPoint.x, this._base[0].secondPoint.y);
        context.lineTo(this._base[1].secondPoint.x, this._base[1].secondPoint.y);
        context.lineTo(this._base[1].firstPoint.x, this._base[1].firstPoint.y);
        context.closePath();
        context.fillStyle = bgColor;
        context.fill();
        context.strokeStyle = bgColor;
        context.stroke(); // If you want to keep the border, you can include this line
        context.fillStyle = wallColor;
        context.strokeStyle = wallColor;
    }
}