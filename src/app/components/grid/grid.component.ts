// grid.component.ts
import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';

@Component({
    selector: 'app-grid',
    standalone: true,
    template: '<canvas #gridCanvas></canvas>',
    styles: ['canvas { border: 1px solid #000; }']
})
export class GridComponent implements AfterViewInit {
    @ViewChild('gridCanvas', {static: true}) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D | null = null;
    private canvasRect: DOMRect | null = null;

    ngAfterViewInit() {
        this.context = this.gridCanvas.nativeElement.getContext('2d');
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.drawGrid();
    }

    setGridSize(): void {
        if (this.context) {
            // Set canvas dimensions to match window size
            this.gridCanvas.nativeElement.width = window.innerWidth - 75;
            this.gridCanvas.nativeElement.height = window.innerHeight - (87 + 115);
        }
    }


    // Draw the grid
    drawGrid() {
        if (this.context) {
            const gridSize = 30;

            this.context.strokeStyle = 'black';

            if (this.canvasRect != null) {
                // Draw vertical lines
                for (let x = 0; x <= this.canvasRect.width; x += gridSize) {
                    this.context.beginPath();
                    this.context.moveTo(x, 0);
                    this.context.lineTo(x, this.canvasRect.height);
                    this.context.stroke();
                }

                // Draw horizontal lines
                for (let y = 0; y <= this.gridCanvas.nativeElement.height; y += gridSize) {
                    this.context.beginPath();
                    this.context.moveTo(0, y);
                    this.context.lineTo(this.canvasRect.width, y);
                    this.context.stroke();
                }
            }
        }
    }

    clear(): void {
        this.context!.clearRect(0, 0, this.canvasRect!.width, this.canvasRect!.height);

    }


    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.setGridSize();
        this.canvasRect = this.gridCanvas.nativeElement.getBoundingClientRect();
        this.gridCanvas.nativeElement.translate
        this.clear();
        this.drawGrid();
    }

}
