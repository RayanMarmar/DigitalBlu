import {Injectable} from '@angular/core';
import {Line} from "../models/line";
import {Point} from "../models/point";
import {Wall} from "../models/wall";

@Injectable({
    providedIn: 'root'
})
export class ArchiveService {
    private _pointsList: Point[];
    private _archivePointsList: Point[];
    private _linesList: Line[];
    private _archiveLinesList: Line[];
    private _wallsList: Wall[];
    private _archiveWallsList: Wall[];

    constructor() {
        this._linesList = [];
        this._archiveLinesList = [];
        this._pointsList = [];
        this._archivePointsList = [];
        this._wallsList = [];
        this._archiveWallsList = [];
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

    get wallsList(): Wall[] {
        return this._wallsList;
    }

    set wallsList(value: Wall[]) {
        this._wallsList = value;
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

    pushWall(wall: Wall): void {
        this._wallsList.push(wall);
    }

    popWall(): void {
        this._wallsList.pop();
    }

    addLine(line: Line): void {
        this._linesList.pop();
        this._linesList.push(line);
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
    }

    addWall(wall: Wall): void {
        this._wallsList.pop();
        this._wallsList.push(wall);
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
    }


    undo(): void {
        if (!this.containsElements())
            return;
        let line: Line | undefined = this._linesList.pop();
        if (line != undefined) {
            this._archiveLinesList.push(line);
            this._archivePointsList.push(this._pointsList.pop()!!);
            if (this.ghostPoint()) {
                this._archivePointsList.push(this._pointsList.pop()!!);
            }
        }
    }

    redo(): void {
        if (!this.containsArchivedElements())
            return;
        let line: Line | undefined = this._archiveLinesList.pop();
        if (line != undefined) {
            this._linesList.push(line);
            this._pointsList.push(this._archivePointsList.pop()!!);
            if (this.shouldAddPoint(line)) {
                this._pointsList.push(this._archivePointsList.pop()!!);
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
