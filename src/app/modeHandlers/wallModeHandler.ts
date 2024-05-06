import './modeHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {GridService} from "../services/grid.service";
import {Wall} from "../drawables/wall";
import {Line} from "../drawables/line";

export class WallModeHandler implements ModeHandler {
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
        let wall: Wall = new Wall(
            this.mouse.clickedCoordinates!!,
            this.snapAngle(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!, Math.PI / 6),
            this.modesConfiguration.defaultThickness,
            this.transformationService.reverseTransformationMatrix
        );
        if (this.mouse.notFirstMouseMoveEvent)
            this.archiveService.popWall();
        this.archiveService.pushWall(wall);
        this.mouse.notFirstMouseMoveEvent = true;
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

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.handleEscape();
        }
    }


    private handleEscape(): void {
        if (this.modesConfiguration.drawing) {
            this.modesConfiguration.drawing = false;
            if (this.mouse.moving) {
                this.mouse.moving = false;
                this.archiveService.deleteWall();
            }
        }
    }

    snapAngle(referencePoint: Point, currentPoint: Point, requestedAngle: number): Point {
        let line: Line = new Line(
            referencePoint,
            currentPoint
        );

        // Calculate the closest number of requested radian intervals
        const intervals: number = Math.round(line.getAngleWithXVector() / requestedAngle);

        // Calculate the nearest angle divisible by the requested angle degrees
        const closestAngle: number = intervals * requestedAngle;

        return line.firstPoint.projectCursorToAngleVector(closestAngle, line.secondPoint);
    }
}