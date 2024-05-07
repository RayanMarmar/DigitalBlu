import {Component} from '@angular/core';
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
    constructor(
        public modesConfiguration: ModesConfiguration,
        private gridService: GridService,
        private canvasService: CanvasService,
        private transformationService: TransformationService,
    ) {
    }

    zoomIn() {
        if (this.modesConfiguration.zoomLevel < this.modesConfiguration.maxZoom) {
            this.modesConfiguration.zoomLevel += 10;
            this.transformationService.scaleValue = this.modesConfiguration.zoomLevel;
            this.gridService.updateCanvas();
            this.canvasService.drawAll()
        }
    }

    zoomOut() {
        if (this.modesConfiguration.zoomLevel > this.modesConfiguration.minZoom) {
            this.modesConfiguration.zoomLevel -= 10;
            this.transformationService.scaleValue = this.modesConfiguration.zoomLevel;
            this.gridService.updateCanvas();
            this.canvasService.drawAll()
        }
    }
}
