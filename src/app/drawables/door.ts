import {DoorType} from "./doorType";
import {Line} from "./line";
import {Point} from "./point";
import {Wall} from "./wall";
import {WallOpening} from "./wallOpening";
import "./drawable";

export class Door extends WallOpening implements Drawable {
    private _doorType: DoorType;
    private _radius: number;
    private _direction: number;

    constructor(
        wall: Wall,
        point: Point,
        doorType: DoorType = DoorType.OPEN_LEFT,
        direction: number = 1,
        height: number = 50,
        radius: number = 50,
    ) {
        super(wall, point, height);
        this._radius = radius
        this._doorType = doorType;
        this._direction = direction;
        this.updateDoorType(doorType);
        this.updateDoorDirection(direction);
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
        let line: Line | null = this._base[0];
        if (this._doorType == DoorType.OPEN_TWO_WAY || doorType == DoorType.OPEN_TWO_WAY) {
            line = this._direction > 0 ? this._wall.thirdLine : this._wall.firstLine;
            line = line.subLine(this._base[0].calculateCenter(), factor * this._radius);
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
        line = line.subLine(this._base[0].calculateCenter(), factor * this.radius);
        if (line == null)
            throw new Error("No sub line found");
        this.updateDoorInfos(line);
    }

    updateDoorInfos(baseLine: Line) {
        this._base[0] = baseLine;
        let secondLine: Line | null = this._direction > 0 ? this._wall.firstLine : this._wall.thirdLine;
        this._base[0] = baseLine;
        this._base[1] = secondLine.subLine(
            this._base[0].calculateCenter(), this._base[0].calculateDistance()
        )!!;
        this._parallelLine = this._base[0].calculateParallelLine(
            this.height, this._wall.xFactor, this._wall.yFactor, this._direction
        );
        this.resetCenter();
    }

    resetCenter(): void {
        this._center = this._doorType == DoorType.OPEN_LEFT ? this._base[0].firstPoint :
            this._doorType == DoorType.OPEN_RIGHT ? this._base[0].secondPoint : this._base[0].calculateCenter();
    }

    override toString(): string {
        return this._doorType + " coordinates: " + this._base[0].toString();
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

    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        wallColor: string,
        transformationMatrix: number[][],
    ): void {
        let door: Door = this.transform(transformationMatrix);
        // Draw quarter circle based on door type
        switch (door.doorType) {
            case DoorType.OPEN_LEFT:
                this.drawQuarterCircle(
                    context,
                    door.center,
                    door.base[0].secondPoint,
                    door.parallelLine.firstPoint,
                    door.radius,
                    door.direction < 0,
                    wallColor
                );
                new Line(door.parallelLine.firstPoint, door.base[0].firstPoint).draw(context, canvasColor, wallColor);
                break;

            case DoorType.OPEN_RIGHT:
                this.drawQuarterCircle(
                    context,
                    door.center,
                    door.parallelLine.secondPoint,
                    door.base[0].firstPoint,
                    door.radius,
                    door.direction < 0,
                    wallColor
                );
                new Line(door.parallelLine.secondPoint, door.base[0].secondPoint).draw(context, canvasColor, wallColor);
                break;

            case DoorType.OPEN_TWO_WAY:
                // Draw two quarter circles for OPEN_TWO_WAY
                this.drawQuarterCircle(
                    context,
                    door.base[0].firstPoint,
                    door.center,
                    door.parallelLine.firstPoint,
                    door.radius,
                    door.direction < 0,
                    wallColor
                );
                this.drawQuarterCircle(
                    context,
                    door.base[0].secondPoint,
                    door.parallelLine.secondPoint,
                    door.center,
                    door.radius,
                    door.direction < 0,
                    wallColor
                );

                new Line(door.parallelLine.firstPoint, door.base[0].firstPoint).draw(context, canvasColor, wallColor);
                new Line(door.parallelLine.secondPoint, door.base[0].secondPoint).draw(context, canvasColor, wallColor);
                break;

            default:
                // Invalid door type
                console.error("Invalid door type");
                return;
        }
        door.drawOpening(context, canvasColor, wallColor);
    }

    transform(transformationMatrix: number[][]): Door {
        return new Door(
            this._wall.transform(transformationMatrix),
            this._base[0].calculateCenter().transform(transformationMatrix),
            this._doorType,
            this._direction,
            this.height * transformationMatrix[0][0],
            this._radius * transformationMatrix[0][0]
        );
    }

    shiftElement(x :number , y : number): void{

        let wallLength = this.wall.firstLine.calculateDistance();
        let center = this.wall.firstLine.calculateCenter();

        // Calculate new points after shifting
        let p1 = new Point(this.base[0].firstPoint.x + x, this.base[0].firstPoint.y + y);
        let p2 = new Point(this.base[0].secondPoint.x + x, this.base[0].secondPoint.y + y);


        let p3 = new Point(this.base[1].firstPoint.x + x, this.base[1].firstPoint.y + y);
        let p4 = new Point(this.base[1].secondPoint.x + x, this.base[1].secondPoint.y + y);


        let l1 = new Line(
            p1,
            this.wall.firstLine.secondPoint
        )
        let l2 = new Line(
            p2,
            this.wall.firstLine.firstPoint
        )

        let l3 = new Line(
            this.base[0].secondPoint,
            p4
        )
        let l4 = new Line(
            this.base[0].firstPoint,
            p3
        )

        // Check if both new points are on the wall and within its length
        if (
            l1.calculateDistance() < wallLength  && l2.calculateDistance() < wallLength

        ) {
            // If both points are within the wall, update the window's position
            this.base[0].firstPoint.x = p1.x;
            this.base[0].firstPoint.y = p1.y;
            this.base[0].secondPoint.x = p2.x;
            this.base[0].secondPoint.y = p2.y;

            this.base[1].firstPoint.x = this.base[1].firstPoint.x + x;
            this.base[1].firstPoint.y = this.base[1].firstPoint.y + y;
            this.base[1].secondPoint.x = this.base[1].secondPoint.x + x;
            this.base[1].secondPoint.y = this.base[1].secondPoint.y + y;

        }
    }
}