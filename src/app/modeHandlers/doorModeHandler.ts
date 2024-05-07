import './modeHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";

export class DoorModeHandler implements ModeHandler {
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

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === ' ') {
            this.changeDoorOrientation();
        } else if (event.key === 'ArrowUp') {
            this.changeDoorDirection(true);
        } else if (event.key === 'ArrowDown') {
            this.changeDoorDirection(false);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
    }


    private changeDoorOrientation(): void {
        let door: Door | undefined = this.archiveService.doorsList.pop();
        if (door != undefined) {
            door.updateDoorType((door.doorType + 1) % 3);
            this.archiveService.doorsList.push(door);
        }
    }

    private changeDoorDirection(up: boolean): void {
        let door: Door | undefined = this.archiveService.doorsList.pop();
        if (door != undefined) {
            door.updateDoorDirection(up ? -1 : 1);
            this.archiveService.doorsList.push(door);
        }
    }
}