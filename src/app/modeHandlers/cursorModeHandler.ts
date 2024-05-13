import './modeHandler';
import {Mouse} from "../models/mouse";
import {GridService} from "../services/grid.service";
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
        private gridService: GridService,
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
            console.log("Problem on down cursor mode", e)
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        if (this.modesConfiguration.moveMode && this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null) {
            let delta = this.moveService.calculateDeltaCoord(this.previousCoords !, this.mouse.currentCoordinates!);
            this.previousCoords = this.mouse.currentCoordinates!;
            this.moveService.moveElement(delta, this.archiveService.selectedElement);
            this.delta = new Point(this.delta.x + delta.x, this.delta.y + delta.y);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        try {
            if (this.modesConfiguration.moveMode && this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null) {
                let delta = this.moveService.calculateDeltaCoord(this.previousCoords !, this.mouse.currentCoordinates!);

                this.archiveService.moveElement(
                    this.delta,
                    this.archiveService.selectedElement,
                    this.moveService
                )

                this.moveService.moveElement(delta, this.archiveService.selectedElement);
                this.previousCoords = this.mouse.currentCoordinates!;
                this.gridService.updateCanvas();
            }
            this.delta = new Point(0, 0);
            this.modesConfiguration.moveMode = false;
        } catch (e) {
            console.log("Problem on down cursor mode", e)
        }
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }
}