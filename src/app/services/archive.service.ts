import {Injectable} from '@angular/core';
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import "../commands/command";
import {DrawCommand} from "../commands/drawCommand";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";
import {DeleteCommand} from "../commands/deleteCommand";
import {LinkedDrawables} from "../models/linkedDrawables";


@Injectable({
    providedIn: 'root'
})
export class ArchiveService {
    private _archivePointsList: Point[];
    private _linesList: Line[];
    private _archiveLinesList: Line[];
    private _wallsList: Wall[];
    private _archiveWallsList: Wall[];
    private _doorsList: Door[];
    private _archiveDoorsList: Door[];
    private _windowsList: Window[];
    private _archiveWindowsList: Window[];
    private commandsList: Command[];
    private archiveCommandsList: Command[];
    private _linkedDrawables: LinkedDrawables;
    private _selectedElement: Drawable | null = null;
    private _upToDate: boolean = true;

    constructor() {
        this._linesList = [];
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._wallsList = [];
        this._archiveWallsList = [];
        this.commandsList = [];
        this.archiveCommandsList = [];
        this._doorsList = [];
        this._archiveDoorsList = [];
        this._windowsList = [];
        this._archiveWindowsList = [];
        this._linkedDrawables = new LinkedDrawables();
    }

    get upToDate(): boolean {
        return this._upToDate;
    }

    set upToDate(value: boolean) {
        this._upToDate = value;
    }

    get archivePointsList(): Point[] {
        return this._archivePointsList;
    }

    set archivePointsList(value: Point[]) {
        this._archivePointsList = value;
    }

    get archiveLinesList(): Line[] {
        return this._archiveLinesList;
    }

    set archiveLinesList(value: Line[]) {
        this._archiveLinesList = value;
    }

    get archiveWallsList(): Wall[] {
        return this._archiveWallsList;
    }

    set archiveWallsList(value: Wall[]) {
        this._archiveWallsList = value;
    }

    get archiveDoorsList(): Door[] {
        return this._archiveDoorsList;
    }

    set archiveDoorsList(value: Door[]) {
        this._archiveDoorsList = value;
    }

    get selectedElement(): Drawable | null {
        return this._selectedElement;
    }

    set selectedElement(value: Drawable | null) {
        this._selectedElement = value;
    }

    get linesList(): Line[] {
        return this._linesList;
    }

    set linesList(value: Line[]) {
        this._linesList = value;
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

    get linkedDrawables(): LinkedDrawables {
        return this._linkedDrawables;
    }

    pushLine(line: Line): void {
        this._linesList.push(line);
    }

    popLine(): void {
        this._linesList.pop();
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

    addCommand(command: Command): void {
        this.commandsList.push(command);
        this.upToDate = false;
    }

    private clearArchive(): void {
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
        this._archiveDoorsList = [];
        this._archiveWindowsList = [];
        this.archiveCommandsList = [];
    }

    addLine(line: Line, fromSaved: boolean = false): void {
        this._linesList.push(line);
        this._linkedDrawables.addDrawable(line.firstPoint, line);
        this._linkedDrawables.addDrawable(line.secondPoint, line);

        if (!fromSaved) {
            this._linesList.pop();
            let command = new DrawCommand(
                this._linkedDrawables,
                this._linesList,
                this._archiveLinesList,
            );
            this.addCommand(command);
            this.clearArchive();
        }
    }

    addWall(wall: Wall, fromSaved: boolean = false): void {
        this._wallsList.push(wall);
        this._linkedDrawables.addDrawable(wall.fourthLine.calculateCenter(), wall);
        this._linkedDrawables.addDrawable(wall.secondLine.calculateCenter(), wall);
        
        if (!fromSaved) {
            this._wallsList.pop();
            let command = new DrawCommand(
                this._linkedDrawables,
                this._wallsList,
                this._archiveWallsList,
            );
            this.addCommand(command);
            this.clearArchive();
        }
    }

    addDoor(door: Door): void {
        this._doorsList.push(door);
        door.wall.addWallOpening(door);
        let command = new DrawCommand(
            this._linkedDrawables,
            this._doorsList,
            this._archiveDoorsList,
        );
        this.addCommand(command);
        this.clearArchive();
    }

    addWindow(window: Window): void {
        this._windowsList.push(window);
        window.wall.addWallOpening(window);
        let command = new DrawCommand(
            this._linkedDrawables,
            this._windowsList,
            this._archiveWindowsList,
        );
        this.addCommand(command);
        this.clearArchive();
    }


    undo(): void {
        if (!this.containsElements())
            return;
        let command: Command | undefined = this.commandsList.pop();
        if (command != undefined) {
            command.undo();
            this.archiveCommandsList.push(command);
        }
    }

    redo(): void {
        if (!this.containsArchivedElements())
            return;
        let command: Command | undefined = this.archiveCommandsList.pop();
        if (command != undefined) {
            command.execute();
            this.addCommand(command);
        }
    }

    containsArchivedElements(): boolean { //redo
        return this.archiveCommandsList.length > 0;
    }

    containsElements(): boolean { //undo
        return this.commandsList.length > 0;
    }

    snapPoint(point: Point, snapMode: boolean): Point {
        if (!snapMode) return point;
        let pointsList = this._linkedDrawables.keys();
        let index: number = this.inRangeOfAnExistingPoint(point);
        return index == -1 ? point : pointsList[index];
    }

    snapAngle(referencePoint: Point, currentPoint: Point, requestedAngle: number): Point {
        let line: Line = new Line(
            referencePoint,
            currentPoint
        );

        // Calculate the closest number of requested radian intervals
        const intervals: number = Math.round(line.getAngleWithXVector() / requestedAngle);

        // Calculate the nearest angle divisible by the requested angle degrees
        const closestAngle: number = intervals * requestedAngle;

        return line.firstPoint.projectCursorToAngleVector(closestAngle, line.secondPoint);
    }

    snapWallOpening(point: Point): Wall | null {
        let index: number = this.inRangeOfAnExistingWall(point);
        return index == -1 ? null : this._wallsList[index];
    }

    private inRangeOfAnExistingPoint(point: Point): number {
        let pointsList = this._linkedDrawables.keys();
        for (let i: number = 0; i < pointsList.length; i++) {
            const p: Point = pointsList[i];
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

    getNearestWall(point: Point): { min: number, minElement: Wall } {
        let min = Infinity;
        let minElement: Wall | null = null;

        for (const wall of this._wallsList) {
            const distance = wall.calculateNearestPointDistance(point);
            if (distance < min) {
                min = distance;
                minElement = wall;
            }
        }

        return {min: min, minElement: minElement!};
    }

    getNearestLine(point: Point): { min: number, minElement: Line } {
        let min = Infinity;
        let minElement: Line | null = null;

        for (const line of this._linesList) {
            const distance = line.calculateNearestPointDistance(point);
            if (distance < min) {
                min = distance;
                minElement = line;
            }
        }

        return {min: min, minElement: minElement!};
    }

    getNearestWallOpening(point: Point): { min: number, minElement: Door | Window | null } {
        let min = Infinity;
        let minElement: Door | Window | null = null;

        for (const door of this._doorsList) {
            const distance = door.calculateNearestPointDistance(point);
            if (distance < min) {
                min = distance;
                minElement = door;
            }
        }

        for (const window of this._windowsList) {
            const distance = window.calculateNearestPointDistance(point);
            if (distance < min) {
                min = distance;
                minElement = window;
            }
        }

        return {min: min, minElement: minElement!};
    }

    deleteLine(): void {
        let line = this._linesList.pop();
        if (line) {
            this._linkedDrawables.addDrawable(line.firstPoint, line);
            this._linkedDrawables.addDrawable(line.secondPoint, line);
        }
    }

    deleteWall(): void {
        let wall = this._wallsList.pop();
        if (wall) {
            this._linkedDrawables.addDrawable(wall.fourthLine.calculateCenter(), wall);
            this._linkedDrawables.addDrawable(wall.secondLine.calculateCenter(), wall);
        }
    }

    deleteElement(list: Drawable[] | null, archiveList: Drawable[] | null): void {
        if (this.selectedElement === null || list === null || archiveList === null) {
            // Handle case where x is null
        } else {
            let command = new DeleteCommand(
                this._linkedDrawables,
                this._windowsList,
                this._archiveWindowsList,
                this._doorsList,
                this._archiveDoorsList,
                list,
                archiveList,
                this._selectedElement!
            );
            this.commandsList.push(command);
            command.execute();
        }
    }

    getWallByUid(uid: string): Wall | null {
        const wall = this.wallsList.find(w => w.uid === uid);
        return wall ? wall : null;
    }
}
