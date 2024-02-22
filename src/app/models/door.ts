import {DoorType} from "./doorType";
import {Line} from "./line";
import {Point} from "./point";
import {Wall} from "./wall";
import {wallOpening} from "./wallOpening";

export class Door extends wallOpening {
    private _doorType: DoorType;
    private _radius: number = 50;
    private _direction: number = 1;

    constructor(wall: Wall, point: Point) {
        super(wall, point);
        this._doorType = DoorType.OPEN_LEFT;
    }

    // Getter for doorType
    get doorType(): DoorType {
        return this._doorType;
    }

    // Setter for doorType
    set doorType(value: DoorType) {
        this._doorType = value;
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
        let line: Line | null = this.base[0];
        if (this._doorType == DoorType.OPEN_TWO_WAY || doorType == DoorType.OPEN_TWO_WAY) {
            line = this._direction > 0 ? this._wall.thirdLine : this._wall.firstLine;
            line = line.subLine(this.base[0].calculateCenter(), factor * this._radius);
        }

        if (line != null) {
            this._doorType = doorType;
            this.updateDoorInfos(line);
        } else {
            this.updateDoorType((doorType + 1) % 3)
        }
    }

    updateDoorDirection(direction: number) {
        this._direction = direction;
        let line: Line | null = this._direction > 0 ? this._wall.thirdLine : this._wall.firstLine;
        let factor: number = this._doorType == DoorType.OPEN_TWO_WAY ? 2 : 1;
        line = line.subLine(this.base[0].calculateCenter(), factor * this.radius);
        if (line == null)
            throw new Error("No sub line found");
        this.updateDoorInfos(line);
    }

    updateDoorInfos(baseLine: Line) {
        this.base[0] = baseLine;
        let secondLine: Line | null = this._direction > 0 ? this._wall.firstLine : this._wall.thirdLine;
        this.base[0] = baseLine;
        this.base[1] = secondLine.subLine(
            this.base[0].calculateCenter(), this.base[0].calculateDistance()
        )!!;
        this._parallelLine = this.base[0].calculateParallelLine(
            this.height, this._wall.xFactor, this._wall.yFactor, this._direction
        );
        this._center = this._doorType == DoorType.OPEN_LEFT ? this.base[0].firstPoint :
            this._doorType == DoorType.OPEN_RIGHT ? this.base[0].secondPoint : this.base[0].calculateCenter();
    }


    override toString(): string {
        return this._doorType.valueOf() + " coordinates: " + this.base[0].toString();
    }

    private drawQuarterCircle(
        context: CanvasRenderingContext2D,
        center: Point,
        start: Point,
        end: Point,
        radius: number,
        upwards: boolean,
        color: string
    ): void {
        let startAngle: number = Math.atan2(start.y - center.y, start.x - center.x);
        let endAngle: number = Math.atan2(end.y - center.y, end.x - center.x);
        context.beginPath();
        if (upwards)
            context.arc(center.x, center.y, radius, endAngle, startAngle);
        else
            context.arc(center.x, center.y, radius, startAngle, endAngle);
        context.lineTo(center.x, center.y);
        context.strokeStyle = color; // Add a stroke (border) to the quarter circle
        context.stroke(); // Add a stroke (border) to the quarter circle
        context.closePath();
    }

    draw(context: CanvasRenderingContext2D, bgColor: string, wallColor: string): void {
        // Draw quarter circle based on door type
        switch (this._doorType) {
            case DoorType.OPEN_LEFT:
                this.drawQuarterCircle(
                    context,
                    this._center,
                    this.base[0].secondPoint,
                    this._parallelLine.firstPoint,
                    this._radius,
                    this._direction < 0,
                    wallColor
                );
                new Line(this._parallelLine.firstPoint, this.base[0].firstPoint).draw(context, wallColor);
                break;

            case DoorType.OPEN_RIGHT:
                this.drawQuarterCircle(
                    context,
                    this._center,
                    this._parallelLine.secondPoint,
                    this.base[0].firstPoint,
                    this._radius,
                    this._direction < 0,
                    wallColor
                );
                new Line(this._parallelLine.secondPoint, this.base[0].secondPoint).draw(context, wallColor);
                break;

            case DoorType.OPEN_TWO_WAY:
                // Draw two quarter circles for OPEN_TWO_WAY
                this.drawQuarterCircle(
                    context,
                    this.base[0].firstPoint,
                    this._center,
                    this._parallelLine.firstPoint,
                    this._radius,
                    this._direction < 0,
                    wallColor
                );
                this.drawQuarterCircle(
                    context,
                    this.base[0].secondPoint,
                    this._parallelLine.secondPoint,
                    this._center,
                    this._radius,
                    this._direction < 0,
                    wallColor
                );

                new Line(this._parallelLine.firstPoint, this.base[0].firstPoint).draw(context, wallColor);
                new Line(this._parallelLine.secondPoint, this.base[0].secondPoint).draw(context, wallColor);
                break;

            default:
                // Invalid door type
                console.error("Invalid door type");
                return;
        }
        this.drawOpening(context, bgColor, wallColor);
    }
}