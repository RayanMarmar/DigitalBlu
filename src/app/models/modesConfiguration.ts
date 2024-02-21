import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ModesConfiguration {
    private _snapMode: boolean;
    private _lineMode: boolean;
    private _wallMode: boolean;
    private _doorMode: boolean;
    private _windowMode: boolean;
    private _cursorMode: boolean;
    private _grabMode: boolean;
    private _drawing: boolean;
    private _gridOn: boolean;
    private _defaultThickness: number;
    private _zoomLevel: number;


    constructor() {
        this._snapMode = true;
        this._lineMode = false;
        this._wallMode = true;
        this._doorMode = false;
        this._windowMode = false;
        this._cursorMode = false;
        this._grabMode = false;
        this._drawing = false;
        this._gridOn = true;
        this._defaultThickness = 20;
        this._zoomLevel = 100;
    }

    get lineMode(): boolean {
        return this._lineMode;
    }

    set lineMode(value: boolean) {
        this._lineMode = value;
    }

    get snapMode(): boolean {
        return this._snapMode;
    }

    set snapMode(value: boolean) {
        this._snapMode = value;
    }

    get wallMode(): boolean {
        return this._wallMode;
    }

    set wallMode(value: boolean) {
        this._wallMode = value;
    }

    get drawing(): boolean {
        return this._drawing;
    }

    set drawing(value: boolean) {
        this._drawing = value;
    }

    get doorMode(): boolean {
        return this._doorMode;
    }

    set doorMode(value: boolean) {
        this._doorMode = value;
    }

    get gridOn(): boolean {
        return this._gridOn;
    }

    set gridOn(value: boolean) {
        this._gridOn = value;
    }

    get defaultThickness(): number {
        return this._defaultThickness;
    }

    set defaultThickness(value: number) {
        this._defaultThickness = value;
    }

    get windowMode(): boolean {
        return this._windowMode;
    }

    set windowMode(value: boolean) {
        this._windowMode = value;
    }

    get cursorMode(): boolean {
        return this._cursorMode;
    }

    set cursorMode(value: boolean) {
        this._cursorMode = value;
    }

    get grabMode(): boolean {
        return this._grabMode;
    }

    set grabMode(value: boolean) {
        this._grabMode = value;
    }

    get zoomLevel(): number {
        return this._zoomLevel;
    }

    set zoomLevel(value: number) {
        this._zoomLevel = value;
    }

    changeSnapMode(): void {
        this._snapMode = !this._snapMode;
    }

    changeDefaultThickness(value: number) {
        this._defaultThickness = value;
        return this._defaultThickness;
    }

    changeWallMode(): void {
        this._wallMode = true;
        this._doorMode = false;
        this._windowMode = false;
        this._lineMode = false;
        this._cursorMode = false;
        this._grabMode = false;
    }

    changeLineMode(): void {
        this._wallMode = false;
        this._windowMode = false;
        this._doorMode = false;
        this._lineMode = true;
        this._cursorMode = false;
        this._grabMode = false;
    }

    changeDoorMode(): void {
        this._doorMode = true;
        this._wallMode = false;
        this._lineMode = false;
        this._windowMode = false;
        this._cursorMode = false;
        this._grabMode = false;
    }

    changeWindowMode(): void {
        this._windowMode = true;
        this._doorMode = false;
        this._wallMode = false;
        this._lineMode = false;
        this._cursorMode = false;
        this._grabMode = false;
    }

    changeCursorMode(): void {
        this._windowMode = false;
        this._doorMode = false;
        this._wallMode = false;
        this._lineMode = false;
        this._cursorMode = true;
        this._grabMode = false;
    }

    changeGrabMode(): void {
        this._grabMode = true;
        this._windowMode = false;
        this._doorMode = false;
        this._wallMode = false;
        this._lineMode = false;
        this._cursorMode = false;
    }

    changeGridMode(): void {
        this._gridOn = !this._gridOn;
    }

}