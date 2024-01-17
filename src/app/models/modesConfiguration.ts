export class ModesConfiguration {
    private _snapMode: boolean;
    private _wallMode: boolean;
    private _drawing: boolean;

    constructor() {
        this._snapMode = false;
        this._wallMode = false;
        this._drawing = false;
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

    changeSnapMode(): void {
        this._snapMode = !this._snapMode;
    }

    changeWallMode(): void {
        this._wallMode = !this._wallMode;
    }

}