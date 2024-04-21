import './mouseEventHandler';
import {Line} from "../drawables/line";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {GridService} from "../services/grid.service";

class LineModeHandler implements MouseEventHandler {
    constructor(
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
        private gridService: GridService
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = this.snapPoint(point);
        if (this.modesConfiguration.drawing)
            this.archiveService.addLine(
                new Line(this.mouse.clickedCoordinates!!, snapped, this.transformationService.reverseTransformationMatrix)
            )
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
        // Verify if the user is in drawing mode
        if (!this.modesConfiguration.drawing)
            return;

        // Update the current mouse coordinates
        this.mouse.mouseMove(event);

        // Delete old line when needed
        if (this.mouse.notFirstMouseMoveEvent)
            this.archiveService.popLine();
        else
            this.mouse.notFirstMouseMoveEvent = true;

        // Add new line with the new coordinates
        this.archiveService.pushLine(
            new Line(
                this.mouse.clickedCoordinates!!,
                this.mouse.currentCoordinates!!,
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