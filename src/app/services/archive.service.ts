import {Injectable} from '@angular/core';
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import "../commands/command";
import {DrawCommand} from "../commands/drawCommand";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";
import {DeleteCommand} from "../commands/deleteCommand";
import {MoveCommand} from "../commands/moveCommand";


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
    private commandsList: Command[];
    private archiveCommandsList: Command[];
    private _selectedElement: Drawable | null = null;
    private _linkedElementsList : Drawable[] = []

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
        this._linkedElementsList = []
        this._selectedElement = value;
        this.getLinkedElements(this.selectedElement!)
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

    private clearArchive(): void {
        this._archiveLinesList = [];
        this._archivePointsList = [];
        this._archiveWallsList = [];
        this._archiveDoorsList = [];
        this._archiveWindowsList = [];
        this.archiveCommandsList = [];
    }

    addLine(line: Line): void {
        this._linesList.pop();
        this._linesList.push(line);
        let command = new DrawCommand(
            this._pointsList,
            this._archivePointsList,
            this._linesList,
            this._archiveLinesList,
        );
        this.commandsList.push(command);
        this.clearArchive();
    }

    addWall(wall: Wall): void {
        this._wallsList.pop();
        this._wallsList.push(wall);
        let command = new DrawCommand(
            this._pointsList,
            this._archivePointsList,
            this._wallsList,
            this._archiveWallsList,
        );
        this.commandsList.push(command);
        this.clearArchive();
    }

    addDoor(door: Door): void {
        this._doorsList.push(door);
        let command = new DrawCommand(
            this._pointsList,
            this._archivePointsList,
            this._doorsList,
            this._archiveDoorsList,
        );
        this.commandsList.push(command);
        this.clearArchive();
    }

    addWindow(window: Window): void {
        this._windowsList.push(window);
        let command = new DrawCommand(
            this._pointsList,
            this._archivePointsList,
            this._windowsList,
            this._archiveWindowsList,
        );
        this.commandsList.push(command);
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
            console.log("executing command ",command)
            command.execute();
            this.commandsList.push(command);
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

    snapPoint(point: Point, snapMode: boolean): Point {
        if (!snapMode) return point;
        let index: number = this.inRangeOfAnExistingPoint(point);
        return index == -1 ? point : this._pointsList[index];
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

    getNearestWall(point: Point): { min: number, minElement: Wall, nearestPoint : Point } {
        let min = Infinity;
        let minElement: Wall | null = null;
        let nearestPoint: Point | null = null;

        for (const wall of this._wallsList) {
            const wallPoint = wall.calculateNearestPointDistance(point);
            if (wallPoint.distance < min) {
                min = wallPoint.distance;
                minElement = wall;
                nearestPoint= wallPoint.nearestPoint;
            }
        }

        return {min: min, minElement: minElement!,nearestPoint:nearestPoint!};
    }

    getNearestLine(point: Point): { min: number, minElement: Line , nearestPoint : Point } {
        let min = Infinity;
        let minElement: Line | null = null;
        let nearestPoint: Point | null = null;

        for (const line of this._linesList) {
            const linePoint = line.calculateNearestPointDistance(point);
            if (linePoint.distance < min) {
                min = linePoint.distance;
                minElement = line;
                nearestPoint = linePoint.nearestPoint
            }
        }

        return {min: min, minElement: minElement!,nearestPoint:nearestPoint!};
    }

    getNearestWallOpening(point: Point): { min: number, nearestPoint: Point | null, minElement: Door | Window | null } {
        let min = Infinity;
        let nearestPoint: Point | null = null;
        let minElement: Door | Window | null = null;

        for (const door of this._doorsList) {
            const doorPoint = door.calculateNearestPointDistance(point); // Calculate nearest point distance
            if (doorPoint.distance < min) {
                min = doorPoint.distance;
                nearestPoint = doorPoint.point;
                minElement = door;
            }
        }

        for (const window of this._windowsList) {
            const windowPoint = window.calculateNearestPointDistance(point); // Calculate nearest point distance
            if (windowPoint.distance < min) {
                min = windowPoint.distance;
                nearestPoint = windowPoint.point;
                minElement = window;
            }
        }

        return { min: min, nearestPoint: nearestPoint, minElement: minElement! };
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

    deleteElement(list: Drawable[] | null, archiveList: Drawable[] | null): void {
        if (this.selectedElement === null || list === null || archiveList === null) {
            // Handle case where x is null
        } else {
            let command = new DeleteCommand(
                this._pointsList,
                this._archivePointsList,
                this._windowsList,
                this._archiveWindowsList,
                this._doorsList,
                this._archiveDoorsList,
                list,
                archiveList,
                this._selectedElement!
            );
            this.archiveCommandsList.push(command);
            this.redo()
        }
    }

    getLinkedElements(element : Drawable): void{
        let p1 : Point
        let p2 : Point

        if (element instanceof Line){
            let line = element as Line
            p1 = line.firstPoint
            p2 = line.secondPoint
            for (let i: number = 0; i < this._linesList.length; i++) {
                if ( (this._linesList[i].firstPoint.inPointRange(p1) ||  this._linesList[i].firstPoint.inPointRange(p2) ||
                    this._linesList[i].secondPoint.inPointRange(p1) || this._linesList[i].secondPoint.inPointRange(p2)) &&
                    this._linesList[i] != line && !this._linkedElementsList.includes(this._linesList[i] ) && this._linesList[i] !== this.selectedElement &&
                     this._linesList[i] !== element){
                    this._linkedElementsList.push(this._linesList[i])
                    this.getLinkedElements(this._linesList[i])
                }
            }
        }else if (element instanceof Wall){
            let wall = element as Wall
            p1 = wall.firstPoint
            p2 = wall.secondPoint
            for (let i: number = 0; i < this._wallsList.length; i++) {
                if ((this._wallsList[i].firstPoint.inPointRange(p1) ||  this._wallsList[i].firstPoint.inPointRange(p2) ||
                    this._wallsList[i].secondPoint.inPointRange(p1) || this._wallsList[i].secondPoint.inPointRange(p2) ||
                    this._wallsList[i].thirdPoint.inPointRange(p1) ||  this._wallsList[i].thirdPoint.inPointRange(p2) ||
                        this._wallsList[i].fourthPoint.inPointRange(p1) ||  this._wallsList[i].fourthPoint.inPointRange(p2) )&&
                    this._wallsList[i] != wall && !this._linkedElementsList.includes(this._wallsList[i]) && this._wallsList[i] !== this.selectedElement &&
                    this._wallsList[i] !== element ){
                    this._linkedElementsList.push(this._wallsList[i])
                    this.getLinkedElements(this._wallsList[i])
                }
            }
        }else{
            return
        }


    }

    moveElement(element: Drawable,source : Point, target : Point): void{

        let command = new MoveCommand(
            element,
            source,
            target,
            this._windowsList,
            this._archiveWindowsList,
            this._doorsList,
            this._archiveDoorsList,
            this._pointsList,
            this._archivePointsList,
            this._linesList,
            this._archiveLinesList,
            this._wallsList,
            this._archiveWallsList,
            this._linkedElementsList
        )
        this.archiveCommandsList.push(command);
        this.redo()
    }
}
