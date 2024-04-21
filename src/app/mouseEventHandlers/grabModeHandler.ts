import './mouseEventHandler';
import {Mouse} from "../models/mouse";
import {TransformationService} from "../services/transformation.service";
import {GridService} from "../services/grid.service";

class LineModeHandler implements MouseEventHandler {
    constructor(
        private mouse: Mouse,
        private transformationService: TransformationService,
        private gridService: GridService,
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.mouseDown(event, true);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouse.grabbed) {
            this.mouse.mouseMove(event);
            this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!);
            this.gridService.updateCanvas();
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!, true);
        this.mouse.mouseDown(event, true);
    }
}