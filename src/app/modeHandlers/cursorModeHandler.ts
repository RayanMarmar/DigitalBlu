import './modeHandler';
import {Mouse} from "../models/mouse";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {ComponentSelectorService} from "../services/component-selector.service";
import {ModesConfiguration} from "../models/modesConfiguration";
import {MoveService} from "../services/move.service";
import {TransformationService} from "../services/transformation.service";

export class CursorModeHandler implements ModeHandler {
    private previousCoords: Point = new Point(0, 0);
    private delta: Point = new Point(0, 0);

    constructor(
        private mouse: Mouse,
        private archiveService: ArchiveService,
        private componentSelector: ComponentSelectorService,
        private readonly modesConfiguration: ModesConfiguration,
        private moveService: MoveService,
        private transformationService: TransformationService,
    ) {

    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.mouseDown(event);
        try {
            this.previousCoords = this.mouse.clickedCoordinates!.reverseTransform(this.transformationService.reverseTransformationMatrix);
            let {component} = this.componentSelector.getNearestComponent(this.previousCoords);

            this.archiveService.selectedElement = component;
            this.modesConfiguration.moveMode = true
        } catch (e) {
            console.error("Problem on down cursor mode", e)
        }
    }

    onMouseMove(event: MouseEvent): void {
        try {
            this.mouse.setCurrentCoordinatesFromEvent(event);
            if (this.modesConfiguration.moveMode && this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null) {
                let delta = this.moveService.calculateDeltaCoordinates(
                    this.previousCoords!,
                    this.mouse.currentCoordinates!.reverseTransform(this.transformationService.reverseTransformationMatrix)
                );
                this.previousCoords = this.mouse.currentCoordinates!.reverseTransform(this.transformationService.reverseTransformationMatrix);
                this.delta = new Point(this.delta.x + delta.x, this.delta.y + delta.y);
                this.moveService.moveElement(delta, this.archiveService.selectedElement, this.delta);
            }
        } catch (e) {
            console.error("Problem on move cursor mode", e)
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        try {
            if (
                this.modesConfiguration.moveMode &&
                this.mouse.clickedCoordinates !== null &&
                this.archiveService.selectedElement !== null &&
                this.previousCoords!.equals(this.mouse.currentCoordinates!)
            ) {
                let delta = this.moveService.calculateDeltaCoordinates(
                    this.previousCoords !,
                    this.mouse.currentCoordinates!.reverseTransform(this.transformationService.reverseTransformationMatrix)
                );

                this.moveService.moveElement(delta, this.archiveService.selectedElement, this.delta, true);
                this.archiveService.addMoveCommand(
                    this.delta,
                    this.archiveService.selectedElement,
                    this.moveService
                )
            }
            this.delta = new Point(0, 0);
            this.archiveService.selectedElement = null;
            this.modesConfiguration.moveMode = false;
        } catch (e) {
            console.error("Problem on up cursor mode", e)
        }
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }
}