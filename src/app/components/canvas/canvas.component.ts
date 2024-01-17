import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {ModesConfiguration} from "../../models/modesConfiguration";
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
        private modesConfiguration: ModesConfiguration,
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
            // Set canvas dimensions to match window size
            this.canvas.nativeElement.width = window.innerWidth - 75;
            this.canvas.nativeElement.height = window.innerHeight - (87 + 115);
        }
    }

    switchSnapMode() {
        this.modesConfiguration.changeSnapMode();
    }

    undo() {
        this.canvasService.undo();
    }

    redo() {
        this.canvasService.redo();
    }

    @HostListener('document:keydown', ['$event'])
    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.canvasService.handleEscape();
        }
    }
}
