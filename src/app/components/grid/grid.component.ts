// grid.component.ts
import {AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild} from '@angular/core';

@Component({
    selector: 'app-grid',
    standalone: true,
    /*template: '<canvas #gridCanvas (keydown)="onKeyDown($event)"></canvas>',
    styles: ['canvas { border: 1px solid #000; }'],*/
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.css'
})
export class GridComponent implements AfterViewInit {
    @ViewChild('gridCanvas', {static: true}) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D | null = null;
    private canvasRect: DOMRect | null = null;

    private zoomLevel = 1;
    private readonly minZoom = 0.1;
    private readonly maxZoom = 3;

// Inject Renderer2 in the constructor
    constructor(private renderer: Renderer2) {
    }

    ngAfterViewInit() {
        // Replace direct access to the DOM with Renderer2
        this.context = this.gridCanvas.nativeElement.getContext('2d');
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.drawGrid();
    }

    setGridSize(): void {
        if (this.context) {
            this.renderer.setAttribute(this.gridCanvas.nativeElement, 'width', (window.innerWidth - 75).toString());
            this.renderer.setAttribute(this.gridCanvas.nativeElement, 'height', (window.innerHeight - (87 + 115)).toString());
        }
    }


    // Draw the grid
    drawGrid() {
        if (this.context) {
            const gridSize = 30;
            this.context.strokeStyle = 'black';

            if (this.canvasRect != null) {
                this.context.beginPath();

                // Draw vertical lines
                for (let x = 0; x <= this.canvasRect.width; x += gridSize) {
                    this.context.moveTo(x * this.zoomLevel, 0);
                    this.context.lineTo(x * this.zoomLevel, this.canvasRect.height * this.zoomLevel);
                }

                // Draw horizontal lines
                for (let y = 0; y <= this.gridCanvas.nativeElement.height; y += gridSize) {
                    this.context.moveTo(0, y * this.zoomLevel);
                    this.context.lineTo(this.canvasRect.width * this.zoomLevel, y * this.zoomLevel);
                }

                this.context.stroke();
            }
        }
    }

    // Inside GridComponent class
    zoomIn(): void {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel += 0.1;
            this.updateCanvas();
        }
    }

    zoomOut(): void {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel -= 0.1;
            this.updateCanvas();
        }
    }

    private updateCanvas(): void {
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.clear();
        this.drawGrid();
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.onResize);
    }

    clear(): void {
        this.context!.clearRect(0, 0, this.canvasRect!.width, this.canvasRect!.height);

    }


    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.clear();
        this.drawGrid();
    }


    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey) {
            if (event.key === '+') {
                this.zoomIn();
            } else if (event.key === '-') {
                this.zoomOut();
            }
            event.preventDefault();
        }
    }
}
