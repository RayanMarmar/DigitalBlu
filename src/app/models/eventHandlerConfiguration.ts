import {Injectable} from "@angular/core";
import {ModeManagerService} from "../services/mode-manager.service";
import {LineModeHandler} from "../modeHandlers/lineModeHandler";
import {WallModeHandler} from "../modeHandlers/wallModeHandler";
import {DoorModeHandler} from "../modeHandlers/doorModeHandler";
import {WindowModeHandler} from "../modeHandlers/windowModeHandler";
import {GrabModeHandler} from "../modeHandlers/grabModeHandler";
import {EraseModeHandler} from "../modeHandlers/eraseModeHandler";
import {CursorModeHandler} from "../modeHandlers/cursorModeHandler";
import {GlobalHandler} from "../modeHandlers/globalHandler";
import {ArchiveService} from "../services/archive.service";

@Injectable({
    providedIn: 'root',
})
export class EventHandlerConfiguration {
    private eventHandler: ModeHandler;
    private globalHandler: GlobalHandler;

    constructor(
        private modeService: ModeManagerService,
        private archiveService: ArchiveService
    ) {
        this.eventHandler = modeService.wallMode;
        this.globalHandler = modeService.globalHandler;
    }

    setLineMode(): void {
        this.archiveService.selectedElement = null;
        this.eventHandler = this.modeService.lineMode
    }

    get lineMode(): boolean {
        return this.eventHandler instanceof LineModeHandler;
    }

    setWallMode(): void {
        this.archiveService.selectedElement = null;
        this.eventHandler = this.modeService.wallMode;
    }

    get wallMode(): boolean {
        return this.eventHandler instanceof WallModeHandler;
    }

    setDoorMode(): void {
        this.archiveService.selectedElement = null;
        this.eventHandler = this.modeService.doorMode;
    }

    get doorMode(): boolean {
        return this.eventHandler instanceof DoorModeHandler;
    }

    setWindowMode(): void {
        this.archiveService.selectedElement = null;
        this.eventHandler = this.modeService.windowMode;
    }

    get windowMode(): boolean {
        return this.eventHandler instanceof WindowModeHandler;
    }


    setGrabMode(): void {
        this.archiveService.selectedElement = null;
        this.eventHandler = this.modeService.grabMode;
    }

    get grabMode(): boolean {
        return this.eventHandler instanceof GrabModeHandler;
    }

    setCursorMode(): void {
        this.eventHandler = this.modeService.cursorMode;
    }

    get cursorMode(): boolean {
        return this.eventHandler instanceof CursorModeHandler;
    }

    setEraseMode(): void {
        this.archiveService.selectedElement = null;
        this.eventHandler = this.eraseMode ? this.modeService.wallMode : this.modeService.eraseMode;
    }

    get eraseMode(): boolean {
        return this.eventHandler instanceof EraseModeHandler;
    }


    onMouseUp(event: MouseEvent): void {
        this.eventHandler.onMouseUp(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.eventHandler.onMouseDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.eventHandler.onMouseMove(event);
    }

    onMouseOut(event: MouseEvent): void {
        this.eventHandler.onMouseOut(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.eventHandler.onKeyDown(event);
        this.globalHandler.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.eventHandler.onKeyUp(event);
        this.globalHandler.onKeyUp(event);
    }

}