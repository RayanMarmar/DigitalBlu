import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {CanvasService} from "../../services/canvas.service";

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
    private canvasRect: DOMRect | null = null;

    constructor(
        private canvasService: CanvasService,
        private mouse: Mouse
    ) {
    }

    ngAfterViewInit(): void {
        this.context = this.canvas?.nativeElement.getContext('2d');
        this.setCanvasSize();
        this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
        this.mouse.setCanvasRectFromDomRect(this.canvasRect);
        this.canvasService.setCanvas(this.canvas);
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.setCanvasSize();
        this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
        this.mouse.setCanvasRectFromDomRect(this.canvasRect);
        this.canvasService.updateCanvasRect(this.canvasRect);
        this.canvasService.clear();
        this.canvasService.drawAll();
    }

    onMouseDown(event: MouseEvent): void {
        this.canvasService.onMouseDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.canvasService.onMouseMove(event)
    }

    setCanvasSize(): void {
        if (this.context) {
            this.canvas.nativeElement.width = 0.96 * window.innerWidth;
            this.canvas.nativeElement.height = 0.84 * window.innerHeight;
        }
    }

    @HostListener('document:keydown', ['$event'])
    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.canvasService.handleEscape();
        } else if (event.key === ' ') {
            this.canvasService.changeDoorOrientation();
        } else if (event.key === 'ArrowUp') {
            this.canvasService.changeDoorDirection(true);
        } else if (event.key === 'ArrowDown') {
            this.canvasService.changeDoorDirection(false);
        }
    }
}
