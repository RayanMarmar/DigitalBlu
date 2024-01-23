import {DoorType} from "./doorType";
import {Line} from "./line";
import {Point} from "./point";
import {Wall} from "./wall";

export class Door {
    private _line: Line;
    private _wall: Wall;
    private _parallelLine: Line;
    private _doorType: DoorType;
    private _radius: number = 50;
    private height: number = 50;
    private _center: Point;
    private _direction: number = 1;

    constructor(wall: Wall, point: Point) {
        this._wall = wall;
        let line: Line | null = this._direction > 0 ? wall.firstLine : wall.thirdLine;
        line = line.subLine(point, this.radius)
        if (line == null)
            throw new Error("No sub line found");
        this._line = line;
        this._doorType = DoorType.OPEN_LEFT;
        this._parallelLine = this._line.calculateParallelLine(this.height, 1, 1, this._direction);
        this._center = this._line.firstPoint;
    }

    // Getter for line
    get line(): Line {
        return this._line;
    }

    // Setter for line
    set line(value: Line) {
        this._line = value;
    }

    // Getter for doorType
    get doorType(): DoorType {
        return this._doorType;
    }

    // Setter for doorType
    set doorType(value: DoorType) {
        this._doorType = value;
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

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    get direction(): number {
        return this._direction;
    }

    set direction(value: number) {
        this._direction = value;
    }

    updateDoorType(doorType: DoorType) {
        let factor: number = doorType == DoorType.OPEN_TWO_WAY ? 2 : 1;
        let line: Line | null = this._line;
        if (this._doorType == DoorType.OPEN_TWO_WAY || doorType == DoorType.OPEN_TWO_WAY)
            line = this._line.subLine(this._line.calculateCenter(), factor * this._radius);

        if (line != null) {
            this._doorType = doorType;
            this._line = line;
            this._parallelLine = this._line.calculateParallelLine(this.height, 1, 1, this._direction);
            this._center = this._doorType == DoorType.OPEN_LEFT ? this._line.firstPoint :
                this._doorType == DoorType.OPEN_RIGHT ? this._line.secondPoint : this._line.calculateCenter();
        } else {
            this.updateDoorType((doorType + 1) % 3)
        }
    }

    updateDoorDirection(direction: number) {
        this._direction = direction;
        let line: Line | null = this._direction > 0 ? this._wall.firstLine : this._wall.thirdLine;
        let factor: number = this._doorType == DoorType.OPEN_TWO_WAY ? 2 : 1;
        line = line.subLine(this._line.calculateCenter(), factor * this.radius);
        if (line == null)
            throw new Error("No sub line found");
        this._line = line;
        this._parallelLine = this._line.calculateParallelLine(this.height, 1, 1, this._direction);
        this._center = this._doorType == DoorType.OPEN_LEFT ? this._line.firstPoint :
            this._doorType == DoorType.OPEN_RIGHT ? this._line.secondPoint : this._line.calculateCenter();
    }


    toString(): string {
        return this._doorType.valueOf() + " coordinates: " + this.line.toString();
    }

    private drawQuarterCircle(context: CanvasRenderingContext2D, center: Point, radius: number, startAngle: number, endAngle: number): void {
        context.beginPath();
        context.arc(center.x, center.y, radius, startAngle, endAngle);
        context.lineTo(center.x, center.y);
        // Add a fill to the quarter circle with white color
        context.fillStyle = 'white';
        context.fill();
        context.stroke(); // Add a stroke (border) to the quarter circle
        context.closePath();
    }

    draw(context: CanvasRenderingContext2D): void {
        let startAngleLeft: number = Math.atan2(this._line.secondPoint.y - this._center.y, this._line.secondPoint.x - this._center.x);
        let endAngleLeft: number = Math.atan2(this._parallelLine.firstPoint.y - this._center.y, this._parallelLine.firstPoint.x - this._center.x);
        let startAngleRight: number = Math.atan2(this._parallelLine.secondPoint.y - this._center.y, this._parallelLine.secondPoint.x - this._center.x);
        let endAngleRight: number = Math.atan2(this._line.firstPoint.y - this._center.y, this._line.firstPoint.x - this._center.x);
        // Draw quarter circle based on door type
        switch (this._doorType) {
            case DoorType.OPEN_LEFT:
                if (this._direction > 0) {
                    this.drawQuarterCircle(context, this._center, this._radius, startAngleLeft, endAngleLeft);
                } else
                    this.drawQuarterCircle(context, this._center, this._radius, endAngleLeft, startAngleLeft);
                (new Line(this._parallelLine.firstPoint, this._line.firstPoint)).draw(context);
                break;

            case DoorType.OPEN_RIGHT:
                if (this._direction > 0) {
                    this.drawQuarterCircle(context, this._center, this._radius, startAngleRight, endAngleRight);
                } else
                    this.drawQuarterCircle(context, this._center, this._radius, endAngleRight, startAngleRight);
                (new Line(this._parallelLine.secondPoint, this._line.secondPoint)).draw(context);
                break;

            case DoorType.OPEN_TWO_WAY:
                startAngleLeft = Math.atan2(this._center.y - this._line.firstPoint.y, this._center.x - this._line.firstPoint.x);
                endAngleLeft = Math.atan2(this._parallelLine.firstPoint.y - this._line.firstPoint.y, this._parallelLine.firstPoint.x - this._line.firstPoint.x);
                startAngleRight = Math.atan2(this._parallelLine.secondPoint.y - this._line.secondPoint.y, this._parallelLine.secondPoint.x - this._line.secondPoint.x);
                endAngleRight = Math.atan2(this._center.y - this._line.secondPoint.y, this._center.x - this._line.secondPoint.x);
                // Draw two quarter circles for OPEN_TWO_WAY
                if (this._direction > 0) {
                    this.drawQuarterCircle(context, this._line.firstPoint, this._radius, startAngleLeft, endAngleLeft);
                    this.drawQuarterCircle(context, this._line.secondPoint, this._radius, startAngleRight, endAngleRight);
                } else {
                    this.drawQuarterCircle(context, this._line.firstPoint, this._radius, endAngleLeft, startAngleLeft);
                    this.drawQuarterCircle(context, this._line.secondPoint, this._radius, endAngleRight, startAngleRight);
                }

                (new Line(this._parallelLine.firstPoint, this._line.firstPoint)).draw(context);
                (new Line(this._parallelLine.secondPoint, this._line.secondPoint)).draw(context);
                break;

            default:
                // Invalid door type
                console.error("Invalid door type");
                break;
        }
    }
}