import {DoorType} from "./doorType";

export class Line {
    private _line: Line;
    private _doorType: DoorType;

    constructor(line: Line, doorType: DoorType) {
        this._line = line;
        this._doorType = doorType;
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

    toString(): string {
        return this._doorType.valueOf() + " coordinates: " + this.line.toString();
    }
}