import './modeHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import {SnapService} from "../services/snap.service";

export class WallModeHandler implements ModeHandler {
    constructor(
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
        private snapService: SnapService
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let snappedPoint: Point = this.snapService.snapPoint();
        if (this.modesConfiguration.drawing) {
            this.archiveService.addWall(
                new Wall(
                    this.mouse.clickedCoordinates!!,
                    snappedPoint,
                    this.modesConfiguration.defaultThickness,
                    this.transformationService.reverseTransformationMatrix
                )
            );
        }
        this.mouse.mouseDown(event, false, snappedPoint);
        this.archiveService.pushPoint(snappedPoint);
        this.modesConfiguration.drawing = true;
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.modesConfiguration.drawing)
            return;
        this.mouse.mouseMove(event);
        let snappedPoint = this.snapService.snapPoint();
        let wall: Wall = new Wall(
            this.mouse.clickedCoordinates!!,
            snappedPoint,
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
                this.archiveService.deleteWall();
            }
        }
    }
}