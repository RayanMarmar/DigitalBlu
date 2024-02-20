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
    private _drawing: boolean;
    private _gridOn: boolean;
    private _defaultThickness: number;
    private _zoomLevel: number;


    constructor() {
        this._snapMode = true;
        this._lineMode = true;
        this._wallMode = false;
        this._doorMode = false;
        this._windowMode = false;
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
        this._wallMode = !this._wallMode;
        this._doorMode = false;
        this._windowMode = false;
        this._lineMode = false;
    }

    changeLineMode(): void {
        this._wallMode = false;
        this._windowMode = false;
        this._doorMode = false;
        this._lineMode = !this._lineMode;
    }

    changeDoorMode(): void {
        this._doorMode = !this._doorMode;
        this._wallMode = false;
        this._lineMode = false;
        this._windowMode = false;
    }

    changeWindowMode(): void {
        this._windowMode = !this._windowMode;
        this._doorMode = false;
        this._wallMode = false;
        this._lineMode = false;
    }

    changeGridMode(): void {
        this._gridOn = !this._gridOn;
    }
    
}