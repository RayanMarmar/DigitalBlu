import './mouseEventHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {GridService} from "../services/grid.service";
import {Wall} from "../drawables/wall";

export class WallModeHandler implements MouseEventHandler {
    constructor(
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
        private gridService: GridService
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = this.snapPoint(point);
        if (this.modesConfiguration.drawing) {
            this.archiveService.addWall(
                new Wall(
                    this.mouse.clickedCoordinates!!,
                    snapped,
                    this.modesConfiguration.defaultThickness,
                    this.transformationService.reverseTransformationMatrix
                )
            );
        }
        if (snapped.equals(point)) {
            this.mouse.mouseDown(event);
        } else {
            this.mouse.moving = false;
            this.mouse.clickedCoordinates = snapped;
            this.mouse.notFirstMouseMoveEvent = false;
        }
        this.archiveService.pushPoint(snapped);
        this.modesConfiguration.drawing = true;
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.modesConfiguration.drawing)
            return;
        this.mouse.mouseMove(event);
        if (this.mouse.notFirstMouseMoveEvent)
            this.archiveService.popWall();
        else
            this.mouse.notFirstMouseMoveEvent = true;
        this.archiveService.pushWall(new Wall(
                this.mouse.clickedCoordinates!!,
                this.mouse.currentCoordinates!!,
                this.modesConfiguration.defaultThickness,
                this.transformationService.reverseTransformationMatrix
            )
        );
    }

    onMouseUp(event: MouseEvent): void {
    }

    private snapPoint(point: Point): Point {
        let snapped: Point = point;

        if (this.modesConfiguration.snapMode) {
            snapped = this.archiveService.snapPoint(point, true);
            if (!snapped.equals(point)) {
                return snapped;
            }
        }
        if (this.modesConfiguration.gridOn) {
            snapped = this.gridService.calculateNearestGridIntersection(point);
        }
        return snapped;
    }
}