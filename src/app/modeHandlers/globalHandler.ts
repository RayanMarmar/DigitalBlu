import './modeHandler';
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {CanvasService} from "../services/canvas.service";
import {GridService} from "../services/grid.service";

export class GlobalHandler implements ModeHandler {
    constructor(
        private canvasService: CanvasService,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private gridService: GridService,
    ) {
    }

    onMouseDown(event: MouseEvent): void {
    }

    onMouseMove(event: MouseEvent): void {
    }

    onMouseUp(event: MouseEvent): void {
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey) {
            if (event.key === '+') {
                this.zoomIn();
            } else if (event.key === '-') {
                this.zoomOut();
            } else if (event.key === 'z') {
                this.undo();
            } else if (event.key === 'y') {
                this.redo();
            }
            event.preventDefault();
        }
        if (event.key === 'Shift') {
            this.modesConfiguration.straightLineMode = true;
        }

        if (event.key === 'Escape') {
            this.modesConfiguration.helperDisplayed = false;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.modesConfiguration.straightLineMode = false;
        }
    }

    undo() {
        this.canvasService.undo();
    }

    redo() {
        this.canvasService.redo();
    }

    zoomIn() {
        if (this.modesConfiguration.zoomLevel < this.modesConfiguration.maxZoom) {
            this.modesConfiguration.zoomLevel += 10;
            this.transformationService.scaleValue = this.modesConfiguration.zoomLevel;
            this.gridService.updateCanvas();
        }
    }

    zoomOut() {
        if (this.modesConfiguration.zoomLevel > this.modesConfiguration.minZoom) {
            this.modesConfiguration.zoomLevel -= 10;
            this.transformationService.scaleValue = this.modesConfiguration.zoomLevel;
            this.gridService.updateCanvas();
        }
    }
}