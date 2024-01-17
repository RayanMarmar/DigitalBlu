import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {Line} from "../../models/line";
import {Point} from "../../models/point";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {ArchiveService} from "../../services/archive.service";
import {Wall} from "../../models/wall";

@Component({
    selector: 'app-canvas',
    standalone: true,
    imports: [],
    templateUrl: './canvas.component.html',
    styleUrl: './canvas.component.css'
})
export class CanvasComponent implements AfterViewInit {
// its important myCanvas matches the variable name in the template
    @ViewChild('myCanvas', {static: true}) private canvas!: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D | null = null;
    private mouse: Mouse;
    private canvasRect: DOMRect | null = null;
    private modesConfiguration: ModesConfiguration;

    constructor(private archiveService: ArchiveService) {
        this.mouse = new Mouse();
        this.modesConfiguration = new ModesConfiguration();
    }

    ngAfterViewInit(): void {
        this.context = this.canvas?.nativeElement.getContext('2d');
        this.setCanvasSize();
        this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
        this.mouse.setCanvasRectFromDomRect(this.canvasRect);
    }

    onMouseDown(event: MouseEvent): void {
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

    drawWall(wall: Wall) {
        // Draw a black-outlined rectangle
        this.context?.strokeRect(wall.firstPoint.x, wall.firstPoint.y, wall.width, wall.height);
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

    drawAll(): void {
        this.clear();
        this.drawAllLines();
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

    setCanvasSize(): void {
        if (this.context) {
            // Set canvas dimensions to match window size
            this.canvas.nativeElement.width = window.innerWidth;
            this.canvas.nativeElement.height = window.innerHeight;
        }
    }

    switchSnapMode() {
        this.modesConfiguration.changeSnapMode();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.modesConfiguration.drawing) {
            this.modesConfiguration.drawing = false;
            if (this.mouse.moving) {
                this.mouse.moving = false;
                this.archiveService.popLine();
                if (this.archiveService.ghostPoint()) {
                    this.archiveService.popPoint();
                }
            }
            this.drawAll();
        }
    }
}
