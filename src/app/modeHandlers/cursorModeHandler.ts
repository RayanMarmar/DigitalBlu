import './modeHandler';
import {Mouse} from "../models/mouse";
import {TransformationService} from "../services/transformation.service";
import {GridService} from "../services/grid.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {ComponentSelectorService} from "../services/component-selector.service";
import {SnapService} from "../services/snap.service";
import {Line} from "../drawables/line";
import {ModesConfiguration} from "../models/modesConfiguration";

export class CursorModeHandler implements ModeHandler {
    private oldCoords: Point | null = null ;
    constructor(
        private mouse: Mouse,
        private transformationService: TransformationService,
        private gridService: GridService,
        private archiveService : ArchiveService,
        private componentSelector: ComponentSelectorService,
        private snapService: SnapService,
        private readonly modesConfiguration: ModesConfiguration,
    ) {

    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let snappedPoint: Point = this.snapService.snapPoint();
        try {
            let {component, list,
                nearestPoint:point
            } = this.componentSelector.getNearestComponent(snappedPoint);
            this.archiveService.selectedElement = component
            this.oldCoords = point!
            this.modesConfiguration.moveMode = true
            console.log("P")
        } catch (e) {
            console.log("Problem on down cursor mode", e)
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        if (this.modesConfiguration.moveMode) {
            if(this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null ){
                console.log("in move element source is ", this.mouse.clickedCoordinates ! , this.mouse.currentCoordinates!)
                this.archiveService.moveElement(
                    this.archiveService.selectedElement!!,
                    this.oldCoords !,
                    this.mouse.currentCoordinates!
                )
                this.oldCoords = this.mouse.currentCoordinates!
                this.gridService.updateCanvas();
            }

        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        try {
            console.log("mouse up coord", event.x,event.y)
            this.modesConfiguration.moveMode = false
        } catch (e) {
            console.log("Problem on down cursor mode", e)
        }
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }
}