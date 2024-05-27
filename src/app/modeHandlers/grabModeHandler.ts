import './modeHandler';
import {Mouse} from "../models/mouse";
import {TransformationService} from "../services/transformation.service";
import {GridService} from "../services/grid.service";

export class GrabModeHandler implements ModeHandler {
    private grabbed: boolean = false;

    constructor(
        private mouse: Mouse,
        private transformationService: TransformationService,
        private gridService: GridService,
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.mouseDown(event);
        this.grabbed = true;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.grabbed) {
            this.mouse.mouseMove(event);
            this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!);
            this.gridService.updateCanvas();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.grabbed) {
            this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!, true);
            this.grabbed = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }

    onMouseOut(event: MouseEvent): void {
        if (this.grabbed) {
            this.transformationService.setTranslationMatrix(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!, true);
            this.grabbed = false;
        }
    }
}