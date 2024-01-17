export class ModesConfiguration {
    private _snapMode: boolean;
    private _drawing: boolean;

    constructor() {
        this._snapMode = false;
        this._drawing = false;
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

    changeSnapMode(): void {
        this.snapMode = !this.snapMode;
    }

}