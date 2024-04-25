import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ModesConfiguration {
    private _snapMode: boolean;
    private _drawing: boolean;
    private _gridOn: boolean;
    private _defaultThickness: number;
    private _zoomLevel: number;
    private _darkMode: boolean;


    constructor() {
        this._snapMode = true;
        this._drawing = false;
        this._gridOn = true;
        this._defaultThickness = 10;
        this._zoomLevel = 100;
        this._darkMode = false;
    }

    get snapMode(): boolean {
        return this._snapMode;
    }

    set snapMode(value: boolean) {
        this._snapMode = value;
    }

    get drawing(): boolean {
        return this._drawing;
    }

    set drawing(value: boolean) {
        this._drawing = value;
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

    get zoomLevel(): number {
        return this._zoomLevel;
    }

    set zoomLevel(value: number) {
        this._zoomLevel = value;
    }

    get darkMode(): boolean {
        return this._darkMode;
    }

    set darkMode(value: boolean) {
        this._darkMode = value;
    }

    changeSnapMode(): void {
        this._snapMode = !this._snapMode;
    }

    changeDarkMode(): void {
        this._darkMode = !this._darkMode;
    }

    changeDefaultThickness(value: number) {
        this._defaultThickness = value;
        return this._defaultThickness;
    }

    changeGridMode(): void {
        this._gridOn = !this._gridOn;
    }
}