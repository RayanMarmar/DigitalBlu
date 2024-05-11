import './modeHandler';
import {Mouse} from "../models/mouse";
import {GridService} from "../services/grid.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {ComponentSelectorService} from "../services/component-selector.service";
import {SnapService} from "../services/snap.service";
import {ModesConfiguration} from "../models/modesConfiguration";
import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";

export class CursorModeHandler implements ModeHandler {
    private previousCoords: Point | null = null ;
    private originalCoords: Point | null = null ;
    private originalNearestPoint : Point | null = null ;
    constructor(
        private mouse: Mouse,
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
            this.originalCoords = snappedPoint
            this.archiveService.selectedElement = component
            this.previousCoords = point!
            this.originalNearestPoint = point!
            this.modesConfiguration.moveMode = true
        } catch (e) {
            console.log("Problem on down cursor mode", e)
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        if (this.modesConfiguration.moveMode) {
            if(this.mouse.clickedCoordinates !== null && this.archiveService.selectedElement !== null ){
                this.archiveService.moveElement(
                    this.previousCoords !,
                    this.mouse.currentCoordinates!,
                    this.originalCoords!,
                    this.originalNearestPoint!,
                    this.snapService
            )
                this.previousCoords = this.mouse.currentCoordinates!
                this.gridService.updateCanvas();
            }

        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        // this.snapService.snapElementPoints()
        try {
            this.modesConfiguration.moveMode = false
        } catch (e) {
            console.log("Problem on down cursor mode", e)
        }
        this.gridService.updateCanvas();
    }
    onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }
}