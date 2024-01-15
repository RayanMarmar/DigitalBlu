import { Point } from "./point";

export class Mouse {
    private _isPressed: boolean;
    private _clickedCoordinates: Point | null;
    private _currentCoordinates!: Point | null;
    private _canvasRect : Point | null;

    constructor() {
        this._isPressed = false;
        this._clickedCoordinates = null;
        this._currentCoordinates = null;
        this._canvasRect = null
    }

    // Getter for isPressed property
    get isPressed(): boolean {
        return this._isPressed;
    }

    // Setter for isPressed property
    set isPressed(value: boolean) {
        this._isPressed = value;
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
    get currentCoordinates(): Point | null{
        return this._currentCoordinates;
    }

    // Setter for currentCoordinates property
    set currentCoordinates(value: Point) {
        this._currentCoordinates = value;
    }

    // Getter for currentCoordinates property
    get canvasRect(): Point | null{
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



    mouseDown = (event: MouseEvent) : void =>
    {
        this._isPressed = true;
        this._clickedCoordinates = new Point(
            event.clientX - this._canvasRect!.x, event.clientY - this._canvasRect!.y
        );
    }
    mouseUp = (event: MouseEvent) : void =>
    {
        this._isPressed = false;
        this._currentCoordinates = new Point(
            event.clientX - this._canvasRect!.x, event.clientY - this._canvasRect!.y
        );
    }
    mouseMove = (event: MouseEvent) : void =>
    {
        this._currentCoordinates = new Point(
            event.clientX - this._canvasRect!.x, event.clientY - this._canvasRect!.y
        );
    }
}
