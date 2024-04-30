import './modeHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {ComponentSelectorService} from "../services/component-selector.service";
import {CanvasService} from "../services/canvas.service";

export class EraseModeHandler implements ModeHandler {

    constructor(
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
        private componentSelector: ComponentSelectorService,
        private canvasService: CanvasService,
    ) {
    }


    onMouseUp(event: MouseEvent): void {
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        try {
            this.archiveService.selectedElement = this.componentSelector.getNearestComponent(point);
            this.archiveService.deleteElement(this.archiveService.selectedElement)
        } catch (e) {
            console.log("Problem on down cursor mode", e)
        }

    }

    onMouseMove(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        try {
            this.archiveService.selectedElement = this.componentSelector.getNearestComponent(point);
            this.canvasService.drawAll()

        } catch (e) {
            console.log("Problem on hover cursor mode")
        }
    }
}