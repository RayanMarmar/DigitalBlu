import {Component, HostListener} from '@angular/core';
import {ModesConfiguration} from "../../models/modesConfiguration";
import {GridService} from "../../services/grid.service";
import {CanvasService} from "../../services/canvas.service";
import {TransformationService} from "../../services/transformation.service";


@Component({
    selector: 'app-zoom-controls',
    standalone: true,
    imports: [],
    templateUrl: './zoom-controls.component.html',
    styleUrl: './zoom-controls.component.css'
})
export class ZoomControlsComponent {
    zoomLevel: number = 100;
    private minZoom: number = 50;
    private maxZoom: number = 150;

    constructor(
        private modesConfiguration: ModesConfiguration,
        private gridInteractionService: GridService,
        private canvasService: CanvasService,
        private transformationService: TransformationService,
    ) {
    }

    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel += 10;
            this.modesConfiguration.zoomLevel = this.zoomLevel;
            this.transformationService.scale(this.zoomLevel)
            this.gridInteractionService.updateCanvas();
            this.canvasService.drawAll(true)
        }
    }

    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel -= 10;
            this.modesConfiguration.zoomLevel = this.zoomLevel;
            this.transformationService.scale(this.zoomLevel)
            this.gridInteractionService.updateCanvas();
            this.canvasService.drawAll(true)
        }
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
