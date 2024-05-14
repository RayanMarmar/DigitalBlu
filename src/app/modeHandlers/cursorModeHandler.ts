import './modeHandler';
import {Mouse} from "../models/mouse";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {ComponentSelectorService} from "../services/component-selector.service";
import {ModesConfiguration} from "../models/modesConfiguration";
import {MoveService} from "../services/move.service";

export class CursorModeHandler implements ModeHandler {
    private previousCoords: Point = new Point(0, 0);
    private delta: Point = new Point(0, 0);

    constructor(
        private mouse: Mouse,
        private archiveService: ArchiveService,
        private componentSelector: ComponentSelectorService,
        private readonly modesConfiguration: ModesConfiguration,
        private moveService: MoveService
    ) {

    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        try {
            let {component} = this.componentSelector.getNearestComponent(this.mouse.currentCoordinates!);

            this.archiveService.selectedElement = component;
            this.previousCoords = this.mouse.currentCoordinates!;
            this.modesConfiguration.moveMode = true
        } catch (e) {
            console.error("Problem on down cursor mode", e)
        }
    }

    onMouseMove(event: MouseEvent): void {
        try {
            this.mouse.setCurrentCoordinatesFromEvent(event);
            if (this.modesConfiguration.moveMode && this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null) {
                let delta = this.moveService.calculateDeltaCoord(this.previousCoords!, this.mouse.currentCoordinates!);
                this.previousCoords = this.mouse.currentCoordinates!;
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
            if (this.modesConfiguration.moveMode && this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null) {
                let delta = this.moveService.calculateDeltaCoord(this.previousCoords !, this.mouse.currentCoordinates!);
                this.moveService.moveElement(delta, this.archiveService.selectedElement, this.delta, true);

                this.archiveService.moveElement(
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