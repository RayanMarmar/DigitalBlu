import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ModesConfiguration {
    private _snapMode: boolean;
    private _wallMode: boolean;
    private _doorMode: boolean;
    private _windowMode: boolean;
    private _drawing: boolean;
    private _gridOn: boolean;

    constructor() {
        this._snapMode = false;
        this._wallMode = false;
        this._doorMode = false;
        this._windowMode = false;
        this._drawing = false;
        this._gridOn = false;
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

    set eallMode(value: boolean) {
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

    get windowMode(): boolean {
        return this._windowMode;
    }

    set windowMode(value: boolean) {
        this._windowMode = value;
    }

    changeSnapMode(): void {
        this._snapMode = !this._snapMode;
    }

    changeWallMode(): void {
        this._wallMode = !this._wallMode;
        this._doorMode = false;
        this._windowMode = false;
    }

    changeDoorMode(): void {
        this._doorMode = !this._doorMode;
        this._wallMode = false;
        this._windowMode = false;
    }

    changeWindowMode(): void {
        this._windowMode = !this._windowMode;
        this._doorMode = false;
        this._wallMode = false;
    }

    changeGridMode(): void {
        this._gridOn = !this._gridOn;
    }

}