import {Injectable} from '@angular/core';
import {Line} from "../models/line";
import {Point} from "../models/point";
import {Wall} from "../models/wall";
import {CommandType} from "../commands/commandType";
import {Door} from "../models/door";
import {Window} from "../models/window";

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
    private _doorsList: Door[];
    private _archiveDoorsList: Door[];
    private _windowsList: Window[];
    private _archiveWindowsList: Window[];
    private commandsList: CommandType[];
    private archiveCommandsList: CommandType[];

    constructor() {
        this._linesList = [];
        this._archiveLinesList = [];
        this._pointsList = [];
        this._archivePointsList = [];
        this._wallsList = [];
        this._archiveWallsList = [];
        this.commandsList = [];
        this.archiveCommandsList = [];
        this._doorsList = [];
        this._archiveDoorsList = [];
        this._windowsList = [];
        this._archiveWindowsList = [];
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

    get doorsList(): Door[] {
        return this._doorsList;
    }

    set doorsList(value: Door[]) {
        this._doorsList = value;
    }

    get archiveWindowsList(): Window[] {
        return this._archiveWindowsList;
    }

    set archiveWindowsList(value: Window[]) {
        this._archiveWindowsList = value;
    }

    get windowsList(): Window[] {
        return this._windowsList;
    }

    set windowsList(value: Window[]) {
        this._windowsList = value;
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

    pushDoor(door: Door): void {
        this._doorsList.push(door);
    }

    popDoor(): void {
        this._doorsList.pop();
    }

    pushWindow(window: Window): void {
        this._windowsList.push(window);
    }

    popWindow(): void {
        this._windowsList.pop();
    }

    addLine(line: Line): void {
        this._linesList.pop();
        this._linesList.push(line);
        this.commandsList.push(CommandType.ADD_LINE);
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
        this._archiveDoorsList = [];
        this._archiveWindowsList = [];
        this.archiveCommandsList = [];
    }

    addWall(wall: Wall): void {
        this._wallsList.pop();
        this._wallsList.push(wall);
        this.commandsList.push(CommandType.ADD_WALL);
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
        this._archiveDoorsList = [];
        this._archiveWindowsList = [];
        this.archiveCommandsList = [];
    }

    addDoor(door: Door): void {
        this._doorsList.push(door);
        this.commandsList.push(CommandType.ADD_DOOR);
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
        this._archiveDoorsList = [];
        this._archiveWindowsList = [];
        this.archiveCommandsList = [];
    }

    addWindow(window: Window): void {
        this._windowsList.push(window);
        this.commandsList.push(CommandType.ADD_WINDOW);
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
        this._archiveDoorsList = [];
        this._archiveWindowsList = [];
        this.archiveCommandsList = [];
    }


    undo(): void {
        if (!this.containsElements())
            return;
        let command: CommandType | undefined = this.commandsList.pop();
        if (command != undefined) {
            this.archiveCommandsList.push(command);
            switch (command) {
                case CommandType.ADD_LINE:
                    this.undoLine();
                    break;
                case CommandType.ADD_WALL:
                    this.undoWall();
                    break;
                case CommandType.ADD_DOOR:
                    this.undoDoor();
                    break;
                case CommandType.ADD_WINDOW:
                    this.undoWindow();
                    break;
                default:
                    break;
            }
        }
    }

    undoLine(): void {
        let line: Line | undefined = this._linesList.pop();
        if (line != undefined) {
            this._archiveLinesList.push(line);
            this._archivePointsList.push(this._pointsList.pop()!!);
            if (this.ghostPoint()) {
                this._archivePointsList.push(this._pointsList.pop()!!);
            }
        }
    }

    undoWall(): void {
        let wall: Wall | undefined = this._wallsList.pop();
        if (wall != undefined) {
            this._archiveWallsList.push(wall);
        }
    }

    undoDoor(): void {
        let door: Door | undefined = this._doorsList.pop();
        if (door != undefined) {
            this._archiveDoorsList.push(door);
        }
    }

    undoWindow(): void {
        let window: Window | undefined = this._windowsList.pop();
        if (window != undefined) {
            this._archiveWindowsList.push(window);
        }
    }

    redo(): void {
        if (!this.containsArchivedElements())
            return;
        let command: CommandType | undefined = this.archiveCommandsList.pop();
        if (command != undefined) {
            this.commandsList.push(command);
            switch (command) {
                case CommandType.ADD_LINE:
                    this.redoLine();
                    break;
                case CommandType.ADD_WALL:
                    this.redoWall();
                    break;
                case CommandType.ADD_DOOR:
                    this.redoDoor();
                    break;
                case CommandType.ADD_WINDOW:
                    this.redoWindow();
                    break;
                default:
                    break;
            }
        }
    }

    redoLine(): void {
        let line: Line | undefined = this._archiveLinesList.pop();
        if (line != undefined) {
            this._linesList.push(line);
            this._pointsList.push(this._archivePointsList.pop()!!);
            if (this.shouldAddPoint(line)) {
                this._pointsList.push(this._archivePointsList.pop()!!);
            }
        }
    }

    redoWall(): void {
        let wall: Wall | undefined = this._archiveWallsList.pop();
        if (wall != undefined) {
            this._wallsList.push(wall);
        }
    }

    redoDoor(): void {
        let door: Door | undefined = this._archiveDoorsList.pop();
        if (door != undefined) {
            this._doorsList.push(door);
        }
    }

    redoWindow(): void {
        let window: Window | undefined = this._archiveWindowsList.pop();
        if (window != undefined) {
            this._windowsList.push(window);
        }
    }

    containsArchivedElements(): boolean { //redo
        return this.archiveCommandsList.length > 0;
    }

    containsElements(): boolean { //undo
        return this.commandsList.length > 0;
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

    snapWallOpening(point: Point): Wall | null {
        let index: number = this.inRangeOfAnExistingWall(point);
        return index == -1 ? null : this._wallsList[index];
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

    private inRangeOfAnExistingWall(point: Point): number {
        for (let i: number = 0; i < this._wallsList.length; i++) {
            const w: Wall = this._wallsList[i];
            if (w.containsPoint(point)) {
                return i; // Return the index if a matching point is found
            }
        }
        return -1; // Return -1 if no matching point is found
    }


    deleteLine(): void {
        this.popLine();
        if (this.ghostPoint()) {
            this.popPoint();
        }
    }

    deleteWall(): void {
        this.popWall();
    }
}
