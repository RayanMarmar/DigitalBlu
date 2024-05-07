import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {GridService} from "./grid.service";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {TransformationService} from "./transformation.service";
import {LineModeHandler} from "../modeHandlers/lineModeHandler";
import {WallModeHandler} from "../modeHandlers/wallModeHandler";
import {DoorModeHandler} from "../modeHandlers/doorModeHandler";
import {WindowModeHandler} from "../modeHandlers/windowModeHandler";
import {GrabModeHandler} from "../modeHandlers/grabModeHandler";
import {EraseModeHandler} from "../modeHandlers/eraseModeHandler";
import {CursorModeHandler} from "../modeHandlers/cursorModeHandler";
import {GlobalHandler} from "../modeHandlers/globalHandler";
import {CanvasService} from "./canvas.service";
import {ComponentSelectorService} from "./component-selector.service";
import {SnapService} from "./snap.service";

@Injectable({
    providedIn: 'root'
})
export class ModeManagerService {

    constructor(
        private archiveService: ArchiveService,
        private gridService: GridService,
        private canvasService: CanvasService,
        private mouse: Mouse,
        private readonly modesConfiguration: ModesConfiguration,
        private transformationService: TransformationService,
        private snapService: SnapService,
        private componentSelector: ComponentSelectorService,
    ) {
    }

    get lineMode(): LineModeHandler {
        return new LineModeHandler(
            this.mouse,
            this.modesConfiguration,
            this.transformationService,
            this.archiveService,
            this.snapService,
        );
    }

    get wallMode(): WallModeHandler {
        return new WallModeHandler(
            this.mouse,
            this.modesConfiguration,
            this.transformationService,
            this.archiveService,
            this.snapService,
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
            this.mouse,
            this.archiveService,
            this.componentSelector,
        );
    }

    get cursorMode(): CursorModeHandler {
        return new CursorModeHandler(
            this.mouse,
            this.transformationService,
            this.gridService,
            this.archiveService,
            this.componentSelector,
            this.snapService,
        );
    }

    get globalHandler(): GlobalHandler {
        return new GlobalHandler(
            this.canvasService,
            this.modesConfiguration,
            this.transformationService,
            this.gridService,
        );
    }
}
