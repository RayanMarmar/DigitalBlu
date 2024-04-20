import {Point} from "./point";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class Mouse {
    private _moving: boolean;
    public grabbed: boolean;
    private _notFirstMouseMoveEvent: boolean;
    private _clickedCoordinates: Point | null;
    private _currentCoordinates!: Point | null;
    private _canvasRect: Point | null;

    constructor() {
        this.grabbed = false;
        this._moving = false;
        this._notFirstMouseMoveEvent = false;
        this._clickedCoordinates = null;
        this._currentCoordinates = null;
        this._canvasRect = null
    }

    // Getter for isPressed property
    get moving(): boolean {
        return this._moving;
    }

    // Setter for isPressed property
    set moving(value: boolean) {
        this._moving = value;
    }

    // Getter for firstMouseMoveEvent property
    get notFirstMouseMoveEvent(): boolean {
        return this._notFirstMouseMoveEvent;
    }

    // Setter for firstMouseMoveEvent property
    set notFirstMouseMoveEvent(value: boolean) {
        this._notFirstMouseMoveEvent = value;
    }

    // Getter for clickedCoordinates property
    get clickedCoordinates(): Point | null {
        return this._clickedCoordinates;
    }

    // Setter for clickedCoordinates property
    set clickedCoordinates(value: Point) {
        this._clickedCoordinates = value;
    }

    // Getter for currentCoordinates property
    get currentCoordinates(): Point | null {
        return this._currentCoordinates;
    }

    // Setter for currentCoordinates property
    set currentCoordinates(value: Point) {
        this._currentCoordinates = value;
    }

    // Setter for currentCoordinates property
    setCurrentCoordinatesFromEvent(event: MouseEvent): void {
        this._currentCoordinates = new Point(
            event.clientX - this._canvasRect!.x, event.clientY - this._canvasRect!.y
        );
    }

    // Getter for currentCoordinates property
    get canvasRect(): Point | null {
        return this._canvasRect;
    }

    // Setter for currentCoordinates property
    set canvasRect(value: Point) {
        this._canvasRect = value;
    }

    // Setter for currentCoordinates property
    setCanvasRectFromDomRect(rect: DOMRect) {
        this._canvasRect = new Point(rect.left, rect.top);
    }

    mouseDown = (event: MouseEvent, grabMode = false): void => {
        this._moving = false;
        this._clickedCoordinates = new Point(
            event.clientX - this._canvasRect!.x, event.clientY - this._canvasRect!.y
        );
        this._notFirstMouseMoveEvent = false;
        this.grabbed = grabMode && !this.grabbed;
    }
    mouseMove = (event: MouseEvent): void => {
        this._moving = true;
        this._currentCoordinates = new Point(
            event.clientX - this._canvasRect!.x, event.clientY - this._canvasRect!.y
        );
    }
}
