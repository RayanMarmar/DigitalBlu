import './mouseEventHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";

export class DoorModeHandler implements MouseEventHandler {
    constructor(
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!.transform(this.transformationService.reverseTransformationMatrix);
        let wall: Wall | null = this.archiveService.snapWallOpening(point);
        if (wall != null) {
            try {
                let door: Door = new Door(wall, point);
                this.archiveService.addDoor(door);
                this.mouse.mouseDown(event);
                this.modesConfiguration.drawing = !this.modesConfiguration;
                this.mouse.moving = false;
            } catch (e) {
                console.log("Insufficient distance for door.");
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
    }

    onMouseUp(event: MouseEvent): void {
    }
}