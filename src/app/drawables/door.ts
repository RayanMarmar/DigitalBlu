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

        let point = this._base[0].calculateCenter();
        console.log("Poitnn Before  ",point.toString())
        point.shiftElement(x, y)
        console.log("Poitnn after  ",point.toString())

        this.wall =  this._wall;
        let line: Line | null = this.wall.thirdLine.subLine(point, this._height);
        let secondLine: Line | null = this.wall.firstLine.subLine(point, this._height);


        if (line == null || secondLine == null)
            throw new Error("No sub line found");
        this._base = [line, secondLine];
        this._parallelLine = this._base[0].calculateParallelLine(
            this._height, this.wall.xFactor, this.wall.yFactor, 1
        );
        this._center = this._base[0].firstPoint;
    }

}