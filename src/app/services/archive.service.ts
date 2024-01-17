import {Injectable} from '@angular/core';
import {Line} from "../models/line";
import {Point} from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class ArchiveService {
    private _linesList: Line[];
    private _archiveLinesList: Line[];
    private _pointsList: Point[];
    private _archivePointsList: Point[];

    constructor() {
        this._linesList = [];
        this._archiveLinesList = [];
        this._pointsList = [];
        this._archivePointsList = [];
    }

    get linesList(): Line[] {
        return this._linesList;
    }

    set linesList(value: Line[]) {
        this._linesList = value;
    }

    get pointsList(): Point[] {
        return this._pointsList;
    }

    set pointsList(value: Point[]) {
        this._pointsList = value;
    }

    pushLine(line: Line): void {
        this._linesList.push(line);
    }

    popLine(): void {
        this._linesList.pop();
    }

    pushPoint(point: Point): void {
        this._pointsList.push(point);
    }

    popPoint(): void {
        this._pointsList.pop();
    }

    addLine(line: Line): void {
        this._linesList.pop();
        this._linesList.push(line);
        this._archiveLinesList = [];
        this._archivePointsList = [];
    }


    undo(): void {
        if (!this.containsElements())
            return;
        let line: Line | undefined = this.linesList.pop();
        if (line != undefined) {
            this._archiveLinesList.push(line);
            this._archivePointsList.push(this.pointsList.pop()!!);
            if (this.ghostPoint()) {
                this._archivePointsList.push(this.pointsList.pop()!!);
            }
        }
    }

    redo(): void {
        if (!this.containsArchivedElements())
            return;
        let line: Line | undefined = this._archiveLinesList.pop();
        if (line != undefined) {
            this.linesList.push(line);
            this.pointsList.push(this._archivePointsList.pop()!!);
            if (this.shouldAddPoint(line)) {
                this.pointsList.push(this._archivePointsList.pop()!!);
            }
        }
    }

    containsArchivedElements(): boolean {
        return this._archiveLinesList.length > 0;
    }

    containsElements(): boolean {
        return this._linesList.length > 0;
    }

    ghostPoint(): boolean {
        if (this._linesList.length == 0) return true;
        let lastLine: Line = this._linesList[this._linesList.length - 1];
        let lastPoint: Point = this._pointsList[this._pointsList.length - 1];

        return !lastLine.isLineExtremity(lastPoint);
    }

    private shouldAddPoint(line: Line): boolean {
        let lastPoint: Point = this._archivePointsList[this._archivePointsList.length - 1];

        return lastPoint != undefined && line.isLineExtremity(lastPoint);
    }

    snapPoint(point: Point, snapMode: boolean): Point {
        if (!snapMode) return point;
        let index: number = this.inRangeOfAnExistingPoint(point);
        return index == -1 ? point : this._pointsList[index];
    }

    private inRangeOfAnExistingPoint(point: Point): number {
        for (let i: number = 0; i < this._pointsList.length; i++) {
            const p: Point = this._pointsList[i];
            if (p.inPointRange(point)) {
                return i; // Return the index if a matching point is found
            }
        }
        return -1; // Return -1 if no matching point is found
    }
}
