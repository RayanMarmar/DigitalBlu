import {ElementRef, Injectable} from '@angular/core';
import {Line} from "../models/line";
import {Point} from "../models/point";
import {ArchiveService} from "./archive.service";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {Wall} from "../models/wall";
import {Door} from "../models/door";
import {DoorType} from "../models/doorType";

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


    drawPoint(point: Point): void {
        if (this.context) {
            this.context.fillRect(point.x, point.y, 1, 1);
        } else {
            console.error('Context is null.');
        }
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

    drawWall(wall: Wall) {
        // Draw a black-outlined rectangle
        this.drawLine(wall.firstLine);
        this.drawLine(wall.secondLine);
        this.drawLine(wall.thirdLine);
        this.drawLine(wall.fourthLine);
    }

    drawDoor(door: Door): void {
        // Draw quarter circle based on door type
        switch (door.doorType) {
            case DoorType.OPEN_LEFT:
                if (door.direction > 0)
                    this.drawQuarterCircle(door.center, door.radius, 0, door.direction * Math.PI / 2);
                else
                    this.drawQuarterCircle(door.center, door.radius, door.direction * Math.PI / 2, 0);
                this.drawLine(new Line(door.parallelLine.firstPoint, door.line.firstPoint));
                break;

            case DoorType.OPEN_RIGHT:
                if (door.direction > 0)
                    this.drawQuarterCircle(door.center, door.radius, door.direction * Math.PI / 2, door.direction * Math.PI);
                else
                    this.drawQuarterCircle(door.center, door.radius, door.direction * Math.PI, door.direction * Math.PI / 2);
                this.drawLine(new Line(door.parallelLine.secondPoint, door.line.secondPoint));
                break;

            case DoorType.OPEN_TWO_WAY:
                // Draw two quarter circles for OPEN_TWO_WAY
                if (door.direction > 0) {
                    this.drawQuarterCircle(door.line.firstPoint, door.radius, 0, door.direction * Math.PI / 2);
                    this.drawQuarterCircle(door.line.secondPoint, door.radius, door.direction * Math.PI / 2, door.direction * Math.PI);
                } else {
                    this.drawQuarterCircle(door.line.firstPoint, door.radius, door.direction * Math.PI / 2, 0);
                    this.drawQuarterCircle(door.line.secondPoint, door.radius, door.direction * Math.PI, door.direction * Math.PI / 2);
                }

                this.drawLine(new Line(door.parallelLine.firstPoint, door.line.firstPoint));
                this.drawLine(new Line(door.parallelLine.secondPoint, door.line.secondPoint));
                break;

            default:
                // Invalid door type
                console.error("Invalid door type");
                break;
        }
    }

    private drawQuarterCircle(center: Point, radius: number, startAngle: number, endAngle: number): void {
        this.context?.beginPath();
        this.context?.arc(center.x, center.y, radius, startAngle, endAngle);
        this.context?.stroke(); // Add a stroke (border) to the quarter circle
        this.context?.closePath();
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

    drawAllWalls(): void {
        this.archiveService.wallsList.forEach((wall: Wall): void => {
            this.drawWall(wall);
        });
    }

    drawAllDoors(): void {
        this.archiveService.doorsList.forEach((door: Door): void => {
            this.drawDoor(door);
        });
    }

    drawAll(): void {
        this.clear();
        this.drawAllLines();
        this.drawAllWalls();
        this.drawAllDoors();
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
        else if (this.modesConfiguration.doorMode)
            this.onMouseDownDoorMode(event);
        else
            this.onMouseDownLineMode(event);
    }

    onMouseDownDoorMode(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        let line: Line = new Line(new Point(point.x - 50 / 2, point.y), new Point(point.x + 50 / 2, point.y));
        let door: Door = new Door(line, DoorType.OPEN_LEFT);
        this.archiveService.addDoor(door);
        this.mouse.mouseDown(event);
        this.modesConfiguration.drawing = !this.modesConfiguration;
        this.mouse.moving = false;
        this.drawAll();
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
        this.modesConfiguration.drawing = true;
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
}
