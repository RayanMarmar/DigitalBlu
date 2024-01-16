import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {Line} from "../../models/line";
import {Point} from "../../models/point";

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
    private linesList: Line[];
    private archiveLinesList: Line[];
    private pointsList: Point[];
    private archivePointsList: Point[];

    constructor() {
        this.mouse = new Mouse();
        this.linesList = [];
        this.archiveLinesList = [];
        this.pointsList = [];
        this.archivePointsList = [];
    }

    ngAfterViewInit(): void {
        this.context = this.canvas?.nativeElement.getContext('2d');
        this.setCanvasSize();
        this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
        this.mouse.setCanvasRectFromDomRect(this.canvasRect);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        if (this.mouse.drawing)
            this.addLine(new Line(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!))
        this.mouse.mouseDown(event);
        let point: Point = new Point(this.mouse.clickedCoordinates!.x, this.mouse.clickedCoordinates!.y);
        this.pointsList.push(point);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouse.drawing)
            return;
        this.mouse.mouseMove(event);
        if (this.mouse.notFirstMouseMoveEvent)
            this.linesList.pop();
        else
            this.mouse.notFirstMouseMoveEvent = true;
        this.linesList.push(new Line(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!));
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

    addLine(line: Line): void {
        this.linesList.pop();
        this.linesList.push(line);
        this.archiveLinesList = [];
        this.archivePointsList = [];
    }

    drawPoint(point: Point): void {
        if (this.context) {
            this.context.fillRect(point.x, point.y, 1, 1);
        } else {
            console.error('Context is null.');
        }
    }

    drawAllLines(): void {
        this.linesList.forEach((line: Line): void => {
            this.drawLine(line);
        });
    }

    drawAllPoints(): void {
        this.pointsList.forEach((point: Point): void => {
            this.drawPoint(point);
        });
    }

    drawAll(): void {
        this.clear();
        this.drawAllLines();
    }

    undo(): void {
        if (!this.containsElements())
            return;
        let line: Line | undefined = this.linesList.pop();
        if (line != undefined) {
            this.archiveLinesList.push(line);
            this.archivePointsList.push(this.pointsList.pop()!!);
            if (this.ghostPoint()) {
                this.archivePointsList.push(this.pointsList.pop()!!);
            }
        }
        this.drawAll();
    }

    redo(): void {
        if (!this.containsArchivedElements())
            return;
        let line: Line | undefined = this.archiveLinesList.pop();
        if (line != undefined) {
            this.linesList.push(line);
            this.pointsList.push(this.archivePointsList.pop()!!);
            if (this.shouldAddPoint(line)) {
                this.pointsList.push(this.archivePointsList.pop()!!);
            }
        }
        this.drawAll();
    }

    containsArchivedElements(): boolean {
        return this.archiveLinesList.length > 0;
    }

    containsElements(): boolean {
        return this.pointsList.length > 0 || this.linesList.length > 0;
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

    ghostPoint(): boolean {
        if (this.linesList.length == 0) return true;
        let lastLine: Line = this.linesList[this.linesList.length - 1];
        let lastPoint: Point = this.pointsList[this.pointsList.length - 1];

        return !lastLine.isLineExtremity(lastPoint);
    }

    shouldAddPoint(line: Line): boolean {
        let lastPoint: Point = this.archivePointsList[this.archivePointsList.length - 1];

        return lastPoint != undefined && line.isLineExtremity(lastPoint);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.mouse.drawing) {
            this.mouse.drawing = false;
            if (this.mouse.moving) {
                this.mouse.moving = false;
                this.linesList.pop();
                if (this.ghostPoint()) {
                    this.pointsList.pop();
                }
            }
            this.drawAll();
        }
    }
}
