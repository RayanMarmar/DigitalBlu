import {Injectable} from "@angular/core";
import {ModeService} from "../services/mode.service";
import {LineModeHandler} from "../drawingModeHandlers/lineModeHandler";
import {WallModeHandler} from "../drawingModeHandlers/wallModeHandler";
import {DoorModeHandler} from "../drawingModeHandlers/doorModeHandler";
import {WindowModeHandler} from "../drawingModeHandlers/windowModeHandler";
import {GrabModeHandler} from "../drawingModeHandlers/grabModeHandler";
import {EraseModeHandler} from "../drawingModeHandlers/eraseModeHandler";
import {CursorModeHandler} from "../drawingModeHandlers/cursorModeHandler";

@Injectable({
    providedIn: 'root',
})
export class EventHandlerConfiguration {
    private eventHandler: DrawingModeHandler;

    constructor(
        private modeService: ModeService
    ) {
        this.eventHandler = modeService.wallMode;
    }

    setLineMode(): void {
        this.eventHandler = this.modeService.lineMode
    }

    get lineMode(): boolean {
        return this.eventHandler instanceof LineModeHandler;
    }

    setWallMode(): void {
        this.eventHandler = this.modeService.wallMode;
    }

    get wallMode(): boolean {
        return this.eventHandler instanceof WallModeHandler;
    }

    setDoorMode(): void {
        this.eventHandler = this.modeService.doorMode;
    }

    get doorMode(): boolean {
        return this.eventHandler instanceof DoorModeHandler;
    }

    setWindowMode(): void {
        this.eventHandler = this.modeService.windowMode;
    }

    get windowMode(): boolean {
        return this.eventHandler instanceof WindowModeHandler;
    }


    setGrabMode(): void {
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

}