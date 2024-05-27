import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {CanvasService} from "../../services/canvas.service";
import {EventHandlerConfiguration} from "../../models/eventHandlerConfiguration";

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
        private mouse: Mouse,
        public eventHandlerConfiguration: EventHandlerConfiguration,
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
        this.canvasService.drawAll(this.eventHandlerConfiguration.eraseMode);
    }

    onMouseDown(event: MouseEvent): void {
        this.eventHandlerConfiguration.onMouseDown(event);
        this.canvasService.drawAll(this.eventHandlerConfiguration.eraseMode);
    }

    onMouseUp(event: MouseEvent): void {
        this.eventHandlerConfiguration.onMouseUp(event);
        this.canvasService.drawAll(this.eventHandlerConfiguration.eraseMode);
    }


    onMouseMove(event: MouseEvent): void {
        this.eventHandlerConfiguration.onMouseMove(event)
        this.canvasService.drawAll(this.eventHandlerConfiguration.eraseMode);
    }

    onMouseOut(event: MouseEvent): void {
        this.eventHandlerConfiguration.onMouseOut(event)
        this.canvasService.drawAll(this.eventHandlerConfiguration.eraseMode);
    }

    setCanvasSize(): void {
        if (this.context) {
            this.canvas.nativeElement.width = 0.96 * window.innerWidth;
            this.canvas.nativeElement.height = 0.84 * window.innerHeight;
        }
    }

    cursorMode() {
        return this.eventHandlerConfiguration.cursorMode;
    }

    eraseMode() {
        return this.eventHandlerConfiguration.eraseMode;
    }

    grabMode() {
        return this.eventHandlerConfiguration.grabMode;
    }
}
