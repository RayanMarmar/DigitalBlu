import {DoorType} from "./doorType";
import {Line} from "./line";
import {Point} from "./point";

export class Door {

    private _line: Line;
    private _parallelLine: Line;
    private _doorType: DoorType;
    private _radius: number;
    private _center: Point;
    private height: number = 30;
    private direction: number = 1;

    constructor(line: Line, doorType: DoorType) {
        this._line = line;
        this._doorType = doorType;
        this._radius = this._doorType == DoorType.OPEN_TWO_WAY ? line.calculateDistance() / 2 : line.calculateDistance();
        this.height = this._radius;
        this._parallelLine = line.calculateParallelLine(this.height, 1, 1, this.direction);
        this._center = this._doorType == DoorType.OPEN_LEFT ? line.firstPoint :
            this._doorType == DoorType.OPEN_RIGHT ? line.secondPoint : line.calculateCenter();
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

    toString(): string {
        return this._doorType.valueOf() + " coordinates: " + this.line.toString();
    }
}