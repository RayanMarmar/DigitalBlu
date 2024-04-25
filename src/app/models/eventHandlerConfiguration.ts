import {Injectable} from "@angular/core";
import {ModeService} from "../services/mode.service";
import {LineModeHandler} from "../mouseEventHandlers/lineModeHandler";
import {WallModeHandler} from "../mouseEventHandlers/wallModeHandler";
import {DoorModeHandler} from "../mouseEventHandlers/doorModeHandler";
import {WindowModeHandler} from "../mouseEventHandlers/windowModeHandler";

@Injectable({
    providedIn: 'root',
})
export class EventHandlerConfiguration {
    private eventHandler: MouseEventHandler;

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