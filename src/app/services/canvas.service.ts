import {ElementRef, Injectable} from '@angular/core';
import {Line} from "../models/line";
import {Point} from "../models/point";
import {ArchiveService} from "./archive.service";
import {GridService} from "./grid.service";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {Wall} from "../models/wall";
import {Door} from "../models/door";
import {Window} from "../models/window";
import {TransformationService} from "./transformation.service";
import {ThemeService} from "./theme.service";

@Injectable({
    providedIn: 'root'
})
export class CanvasService {
    private canvas: ElementRef<HTMLCanvasElement> | null = null;
    private context: CanvasRenderingContext2D | null = null;
    private canvasRect: DOMRect | null = null;

    constructor(
        private archiveService: ArchiveService,
        private gridService: GridService,
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private themeService: ThemeService
    ) {
    }

    setCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
        this.canvas = canvas;
        this.context = this.canvas.nativeElement.getContext("2d");
        this.canvasRect = canvas.nativeElement.getBoundingClientRect();
    }

    private drawAllLines(): void {
        this.archiveService.linesList.forEach((line: Line): void => {
            line.draw(this.context!!,
                this.themeService.getWallColor(),
                this.transformationService.transformationMatrix,
            );
        });
    }

    updateCanvasRect(newValue: DOMRect): void {
        this.canvasRect = newValue;
    }

    private drawAllWalls(): void {
        this.archiveService.wallsList.forEach((wall: Wall): void => {
            wall.draw(this.context!!,
                this.transformationService.transformationMatrix,
                this.themeService.getWallColor());
        });
    }

    private drawAllDoors(): void {
        this.archiveService.doorsList.forEach((door: Door): void => {
            door.draw(this.context!!,
                this.transformationService.transformationMatrix,
                this.themeService.getBackgroundColor(),
                this.themeService.getWallColor());
        });
    }

    private drawAllWindows(): void {
        this.archiveService.windowsList.forEach((window: Window): void => {
            window.draw(this.context!!,
                this.transformationService.transformationMatrix,
                this.themeService.getBackgroundColor(),
                this.themeService.getWallColor());
        });
    }

    drawAll(): void {
        if (this.context == null) {
            console.log("Context is null...")
            return;
        }
        this.clear();
        this.drawAllLines();
        this.drawAllWalls();
        this.drawAllDoors();
        this.drawAllWindows();
    }

    undo(): void {
        this.archiveService.undo();
        this.drawAll();
    }

    redo(): void {
        this.archiveService.redo();
        this.drawAll();
    }

    clear(): void {
        this.context!.clearRect(0, 0, this.canvasRect!.width, this.canvasRect!.height);
    }

    handleEscape(): void {
        if (this.modesConfiguration.drawing) {
            this.modesConfiguration.drawing = false;
            if (this.mouse.moving) {
                this.mouse.moving = false;
                if (this.modesConfiguration.wallMode) {
                    this.archiveService.deleteWall();
                } else if (this.modesConfiguration.lineMode) {
                    this.archiveService.deleteLine();
                }
            }
            this.drawAll();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.modesConfiguration.grabMode) {
            this.mouse.mouseDown(event, true);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.modesConfiguration.grabMode) {
            this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!, true);
            this.mouse.mouseDown(event, true);
            this.drawAll();
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (this.modesConfiguration.wallMode)
            this.onMouseDownWallMode(event);
        else if (this.modesConfiguration.doorMode)
            this.onMouseDownDoorMode(event);
        else if (this.modesConfiguration.windowMode)
            this.onMouseWindowMode(event);
        else if (this.modesConfiguration.lineMode)
            this.onMouseDownLineMode(event);
    }

    onMouseDownDoorMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!.transform(this.transformationService.reverseTransformationMatrix);
        let wall: Wall | null = this.archiveService.snapWallOpening(point);
        if (wall != null) {
            try {
                let door: Door = new Door(wall, point);
                this.archiveService.addDoor(door);
                this.mouse.mouseDown(event);
                this.modesConfiguration.drawing = !this.modesConfiguration;
                this.mouse.moving = false;
                this.drawAll();
            } catch (e) {
                console.log("Insufficient distance for door.");
            }
        }
    }

    onMouseWindowMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!.transform(this.transformationService.reverseTransformationMatrix);
        let wall: Wall | null = this.archiveService.snapWallOpening(point);
        if (wall != null) {
            try {
                let window: Window = new Window(wall, point);
                this.archiveService.addWindow(window);
                this.mouse.mouseDown(event);
                this.modesConfiguration.drawing = !this.modesConfiguration;
                this.mouse.moving = false;
                this.drawAll();
            } catch (e) {
                console.log("Insufficient distance for wall.");
            }
        }
    }

    onMouseDownWallMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = this.snapPoint(point);
        if (this.modesConfiguration.drawing)
            this.archiveService.addWall(
                new Wall(
                    this.mouse.clickedCoordinates!!,
                    snapped,
                    this.modesConfiguration.defaultThickness,
                    this.transformationService.reverseTransformationMatrix
                )
            );
        if (snapped.equals(point)) {
            this.mouse.mouseDown(event);
        } else {
            this.mouse.moving = false;
            this.mouse.clickedCoordinates = snapped;
            this.mouse.notFirstMouseMoveEvent = false;
        }
        this.archiveService.pushPoint(snapped);
        this.modesConfiguration.drawing = true;
    }

    onMouseDownLineMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = this.snapPoint(point);
        if (this.modesConfiguration.drawing)
            this.archiveService.addLine(
                new Line(this.mouse.clickedCoordinates!!, snapped, this.transformationService.reverseTransformationMatrix)
            )
        if (snapped.equals(point)) {
            this.mouse.mouseDown(event);
        } else {
            this.mouse.moving = false;
            this.mouse.clickedCoordinates = snapped;
            this.mouse.notFirstMouseMoveEvent = false;
        }
        this.archiveService.pushPoint(snapped);
        this.modesConfiguration.drawing = true;
    }


    onMouseMove(event: MouseEvent): void {
        if (this.modesConfiguration.grabMode && this.mouse.grabbed) {
            this.mouse.mouseMove(event);
            this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!);
            this.drawAll();
            this.gridService.updateCanvas();
        } else if (this.modesConfiguration.wallMode)
            this.onMouseMoveWallMode(event);
        else if (this.modesConfiguration.lineMode)
            this.onMouseMoveLineMode(event);
    }

    onMouseMoveLineMode(event: MouseEvent): void {
        if (!this.modesConfiguration.drawing)
            return;
        this.mouse.mouseMove(event);
        if (this.mouse.notFirstMouseMoveEvent)
            this.archiveService.popLine();
        else
            this.mouse.notFirstMouseMoveEvent = true;
        this.archiveService.pushLine(
            new Line(
                this.mouse.clickedCoordinates!!,
                this.mouse.currentCoordinates!!,
                this.transformationService.reverseTransformationMatrix
            )
        );
        this.drawAll();
    }

    onMouseMoveWallMode(event: MouseEvent): void {
        if (!this.modesConfiguration.drawing)
            return;
        this.mouse.mouseMove(event);
        if (this.mouse.notFirstMouseMoveEvent)
            this.archiveService.popWall();
        else
            this.mouse.notFirstMouseMoveEvent = true;
        this.archiveService.pushWall(new Wall(
                this.mouse.clickedCoordinates!!,
                this.mouse.currentCoordinates!!,
                this.modesConfiguration.defaultThickness,
                this.transformationService.reverseTransformationMatrix
            )
        );
        this.drawAll();
    }

    changeDoorOrientation(): void {
        if (this.modesConfiguration.doorMode) {
            let door: Door | undefined = this.archiveService.doorsList.pop();
            if (door != undefined) {
                door.updateDoorType((door.doorType + 1) % 3);
                this.archiveService.doorsList.push(door);
                this.drawAll();
            }
        }
    }

    changeDoorDirection(up: boolean): void {
        if (this.modesConfiguration.doorMode) {
            let door: Door | undefined = this.archiveService.doorsList.pop();
            if (door != undefined) {
                door.updateDoorDirection(up ? -1 : 1);
                this.archiveService.doorsList.push(door);
                this.drawAll();
            }
        }
    }

    private snapPoint(point: Point): Point {
        let snapped: Point = point;

        if (this.modesConfiguration.snapMode) {
            snapped = this.archiveService.snapPoint(point, true);
            if (!snapped.equals(point)) {
                return snapped;
            }
        }
        if (this.modesConfiguration.gridOn) {
            snapped = this.gridService.calculateNearestGridIntersection(point);
        }
        return snapped;
    }
}
