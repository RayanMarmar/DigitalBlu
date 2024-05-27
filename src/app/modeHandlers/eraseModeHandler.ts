import './modeHandler';
import {Mouse} from "../models/mouse";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {ComponentSelectorService} from "../services/component-selector.service";
import {TransformationService} from "../services/transformation.service";

export class EraseModeHandler implements ModeHandler {

    constructor(
        private mouse: Mouse,
        private archiveService: ArchiveService,
        private componentSelector: ComponentSelectorService,
        private transformationService: TransformationService,
    ) {
    }

    onMouseUp(event: MouseEvent): void {
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!.reverseTransform(this.transformationService.reverseTransformationMatrix);
        try {
            let {component, list, archiveList} = this.componentSelector.getNearestComponent(point);
            this.archiveService.selectedElement = component;
            this.archiveService.deleteElement(this.archiveService.selectedElement!, list, archiveList);
            this.archiveService.selectedElement = null;
        } catch (e) {
            console.error("Problem on down cursor mode", e);
        }

    }

    onMouseMove(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!.reverseTransform(this.transformationService.reverseTransformationMatrix);
        try {
            const {component} = this.componentSelector.getNearestComponent(point);
            this.archiveService.selectedElement = component;

        } catch (e) {
            console.error("Problem on hover cursor mode");
        }
    }

    onMouseOut(event: MouseEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }
}