import './modeHandler';
import {Line} from "../drawables/line";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {GridService} from "../services/grid.service";

export class LineModeHandler implements ModeHandler {
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
        let snappedPoint: Point = this.snapPoint();
        if (this.modesConfiguration.drawing)
            this.archiveService.addLine(
                new Line(this.mouse.clickedCoordinates!!, snappedPoint, this.transformationService.reverseTransformationMatrix)
            )
        this.mouse.mouseDown(event, false, snappedPoint);
        this.archiveService.pushPoint(snappedPoint);
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
        this.mouse.notFirstMouseMoveEvent = true;

        // Add new line with the new coordinates
        this.archiveService.pushLine(
            new Line(
                this.mouse.clickedCoordinates!!,
                this.snapPoint(),
                this.transformationService.reverseTransformationMatrix
            )
        );
    }

    onMouseUp(event: MouseEvent): void {
    }

    private snapPoint(): Point {
        let point: Point = this.mouse.currentCoordinates!!;
        let snapped: Point = point;
        if (this.modesConfiguration.drawing && this.modesConfiguration.snapAngle !== null) {
            return this.archiveService.snapAngle(
                this.mouse.clickedCoordinates!!,
                this.mouse.currentCoordinates!!,
                this.modesConfiguration.snapAngle
            )
        }
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

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.handleEscape();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
    }


    private handleEscape(): void {
        if (this.modesConfiguration.drawing) {
            this.modesConfiguration.drawing = false;
            if (this.mouse.moving) {
                this.mouse.moving = false;
                this.archiveService.deleteLine();
            }
        }
    }
}