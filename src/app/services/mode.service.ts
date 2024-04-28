import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {GridService} from "./grid.service";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "./transformation.service";
import {LineModeHandler} from "../drawingModeHandlers/lineModeHandler";
import {WallModeHandler} from "../drawingModeHandlers/wallModeHandler";
import {DoorModeHandler} from "../drawingModeHandlers/doorModeHandler";
import {WindowModeHandler} from "../drawingModeHandlers/windowModeHandler";
import {GrabModeHandler} from "../drawingModeHandlers/grabModeHandler";
import {EraseModeHandler} from "../drawingModeHandlers/eraseModeHandler";
import {CursorModeHandler} from "../drawingModeHandlers/cursorModeHandler";

@Injectable({
    providedIn: 'root'
})
export class ModeService {

    constructor(
        private archiveService: ArchiveService,
        private gridService: GridService,
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
    ) {
    }

    get lineMode(): LineModeHandler {
        return new LineModeHandler(
            this.mouse,
            this.modesConfiguration,
            this.transformationService,
            this.archiveService,
            this.gridService,
        );
    }

    get wallMode(): WallModeHandler {
        return new WallModeHandler(
            this.mouse,
            this.modesConfiguration,
            this.transformationService,
            this.archiveService,
            this.gridService,
        );
    }

    get doorMode(): DoorModeHandler {
        return new DoorModeHandler(
            this.mouse,
            this.modesConfiguration,
            this.transformationService,
            this.archiveService,
        );
    }

    get windowMode(): WindowModeHandler {
        return new WindowModeHandler(
            this.mouse,
            this.modesConfiguration,
            this.transformationService,
            this.archiveService,
        );
    }

    get grabMode(): GrabModeHandler {
        return new GrabModeHandler(
            this.mouse,
            this.transformationService,
            this.gridService,
        );
    }

    get eraseMode(): EraseModeHandler {
        return new EraseModeHandler(
        );
    }

    get cursorMode(): CursorModeHandler {
        return new CursorModeHandler(
        );
    }
}
