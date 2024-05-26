// grid.component.ts
import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {GridService} from "../../services/grid.service";
import {Event} from "@angular/router";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {TransformationService} from "../../services/transformation.service";

@Component({
    selector: 'app-grid',
    standalone: true,
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.css'
})
export class GridComponent implements AfterViewInit {
    @ViewChild('gridCanvas', {static: true}) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D | null = null;
    private canvasRect: DOMRect | null = null;

    constructor(
        private transformationService: TransformationService,
        private gridInteractionService: GridService,
        private modeConfiguration: ModesConfiguration
    ) {
    }

    ngAfterViewInit() {
        // Replace direct access to the DOM with Renderer2
        this.gridInteractionService.gridComponent = this;
        this.context = this.gridCanvas.nativeElement.getContext('2d');
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.drawGrid();
    }

    setGridSize(): void {
        if (this.context) {
            this.gridCanvas.nativeElement.width = 0.96 * window.innerWidth;
            this.gridCanvas.nativeElement.height = 0.84 * window.innerHeight;
        }
    }


    // Draw the grid
    // Draw the grid
    drawGrid() {
        if (this.context) {
            this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
            const gridSize = this.modeConfiguration.gridSquareSize * this.modeConfiguration.zoomLevel / 100; // Adjust grid size based on zoom level
            const xDelta = this.transformationService.transformationMatrix[0][2] % gridSize;
            const yDelta = this.transformationService.transformationMatrix[1][2] % gridSize;
            this.context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color');

            if (this.canvasRect != null) {
                this.context.beginPath();

                // Calculate the number of grid lines based on canvas size and grid size
                const numVerticalLines = Math.ceil(this.canvasRect.width / gridSize);
                const numHorizontalLines = Math.ceil(this.canvasRect.height / gridSize);

                // Draw vertical lines
                for (let x = 0; x <= numVerticalLines; x++) {
                    const xOffset = x * gridSize + xDelta;
                    this.context.moveTo(xOffset, 0);
                    this.context.lineTo(xOffset, this.canvasRect.height);
                }

                // Draw horizontal lines
                for (let y = 0; y <= numHorizontalLines; y++) {
                    const yOffset = y * gridSize + yDelta;
                    this.context.moveTo(0, yOffset);
                    this.context.lineTo(this.canvasRect.width, yOffset);
                }

                this.context.stroke();
            }
        }
    }


    updateCanvas(): void {
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.clear();
        this.drawGrid();
    }

    clear(): void {
        this.context!.clearRect(0, 0, this.canvasRect!.width, this.canvasRect!.height);

    }


    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.updateCanvas();
    }
}
