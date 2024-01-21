import {ElementRef, Injectable} from '@angular/core';
import {Line} from "../models/line";
import {Point} from "../models/point";
import {ArchiveService} from "./archive.service";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {Wall} from "../models/wall";

@Injectable({
    providedIn: 'root'
})
export class CanvasService {
    private canvas: ElementRef<HTMLCanvasElement> | null = null;
    private context: CanvasRenderingContext2D | null = null;
    private canvasRect: DOMRect | null = null;

    constructor(
        private archiveService: ArchiveService,
        private mouse: Mouse,
        private modesConfiguration: ModesConfiguration
    ) {
        this.mouse = mouse;
        this.modesConfiguration = modesConfiguration;
    }

    setCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
        this.canvas = canvas;
        this.context = this.canvas.nativeElement.getContext("2d");
        this.canvasRect = canvas.nativeElement.getBoundingClientRect();
    }

    drawLine(line: Line): void {
        if (this.context) {
            this.context.beginPath();
            this.context.moveTo(line.firstPoint.x, line.firstPoint.y);
            this.context.lineTo(line.secondPoint.x, line.secondPoint.y);
            this.context.stroke();
        } else {
            console.error('Context is null.');
        }
    }

    drawPoint(point: Point): void {
        if (this.context) {
            this.context.fillRect(point.x, point.y, 1, 1);
        } else {
            console.error('Context is null.');
        }
    }

    drawAllLines(): void {
        this.archiveService.linesList.forEach((line: Line): void => {
            this.drawLine(line);
        });
    }

    drawAllPoints(): void {
        this.archiveService.pointsList.forEach((point: Point): void => {
            this.drawPoint(point);
        });
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
                } else {
                    this.archiveService.deleteLine();
                }
            }
            this.drawAll();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.modesConfiguration.wallMode)
            this.onMouseDownWallMode(event);
        else
            this.onMouseDownLineMode(event);
    }

    onMouseDownWallMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = this.archiveService.snapPoint(point, this.modesConfiguration.snapMode);
        if (this.modesConfiguration.drawing)
            this.archiveService.addWall(new Wall(this.mouse.clickedCoordinates!!, snapped));
        if (snapped.equals(point)) {
            this.mouse.mouseDown(event);
            this.archiveService.pushPoint(point);
        } else {
            this.mouse.moving = false;
            this.mouse.clickedCoordinates = snapped;
            this.mouse.notFirstMouseMoveEvent = false;
        }
        this.modesConfiguration.drawing = !this.modesConfiguration.drawing;
        this.mouse.moving = false;
    }

    onMouseDownLineMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = this.archiveService.snapPoint(point, this.modesConfiguration.snapMode);
        if (this.modesConfiguration.drawing)
            this.archiveService.addLine(new Line(this.mouse.clickedCoordinates!!, snapped))
        if (snapped.equals(point)) {
            this.mouse.mouseDown(event);
            this.archiveService.pushPoint(point);
        } else {
            this.mouse.moving = false;
            this.mouse.clickedCoordinates = snapped;
            this.mouse.notFirstMouseMoveEvent = false;
        }
        this.modesConfiguration.drawing = true;
    }


    onMouseMove(event: MouseEvent): void {
        if (this.modesConfiguration.wallMode)
            this.onMouseMoveWallMode(event);
        else
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
        this.archiveService.pushLine(new Line(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!));
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
        this.archiveService.pushWall(new Wall(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!));
        this.drawAll();
    }

    drawWall(wall: Wall) {
        // Draw a black-outlined rectangle
        this.drawLine(wall.firstLine);
        this.drawLine(wall.secondLine);
        this.drawLine(wall.thirdLine);
        this.drawLine(wall.fourthLine);
    }

    drawAllWalls(): void {
        this.archiveService.wallsList.forEach((wall: Wall): void => {
            this.drawWall(wall);
        });
    }

    drawAll(): void {
        this.clear();
        this.drawAllLines();
        this.drawAllWalls();
    }
}
