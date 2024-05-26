import './modeHandler';
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "../services/transformation.service";
import {ArchiveService} from "../services/archive.service";
import {Point} from "../drawables/point";
import {Wall} from "../drawables/wall";
import {Window} from "../drawables/window";

export class WindowModeHandler implements ModeHandler {
    constructor(
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
    ) {
    }

    onMouseDown(event: MouseEvent): void {
        this.mouse.setCurrentCoordinatesFromEvent(event);
        let point: Point = this.mouse.currentCoordinates!!.reverseTransform(this.transformationService.reverseTransformationMatrix);
        let wall: Wall | null = this.archiveService.snapWallOpening(point);
        if (wall != null) {
            try {
                let window: Window = new Window(wall, point);
                this.archiveService.addWindow(window);
                this.mouse.mouseDown(event);
                this.modesConfiguration.drawing = !this.modesConfiguration;
                this.mouse.moving = false;
            } catch (e) {
                console.log("Insufficient distance for wall.");
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
    }

    onMouseUp(event: MouseEvent): void {
    }

    onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }
}