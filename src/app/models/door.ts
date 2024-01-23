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
        let factor: number = this._doorType == DoorType.OPEN_TWO_WAY ? 0.5 : doorType == DoorType.OPEN_TWO_WAY ? 2 : 1;
        let line: Line | null = this._line;
        if (this._doorType == DoorType.OPEN_TWO_WAY || doorType == DoorType.OPEN_TWO_WAY)
            line = this._line.subLine(this._line.calculateCenter(), factor * this._radius);

        if (line != null) {
            this._radius = factor * this._radius;
            this._doorType = doorType;
            this._line = this._line.subLine(this._line.calculateCenter(), this._radius) ?? this._line;
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
        line = line.subLine(this._line.calculateCenter(), this.radius);
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
}