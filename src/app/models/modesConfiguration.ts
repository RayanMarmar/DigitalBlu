import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ModesConfiguration {

    private _snapMode: boolean;
    private _straightLineMode: boolean;
    private _snapAngleMode: boolean;
    private _drawing: boolean;
    private _gridOn: boolean;
    private _helperDisplayed: boolean;
    private _canvasName: string = "";
    private _allCanvasNames: string[] = [];
    private _darkMode: boolean;

    // default wall thickness in pixels
    private _defaultThickness: number = 10;
    // Default angle snap PI/6 (30 degrees)
    private _snapRadiantFactor: number = 6;
    // Zoom levels
    private _zoomLevel: number = 100;
    private readonly _minZoom: number = 50;
    private readonly _maxZoom: number = 150;
    // Grid square vertex size in pixels
    private readonly _gridSquareSize: number = 30;
    // Grid vertex value in centimeters
    private readonly _gridUnitValue: number = 30;


    constructor() {
        this._snapMode = true;
        this._straightLineMode = false;
        this._snapAngleMode = false;
        this._drawing = false;
        this._gridOn = true;
        this._darkMode = false;
        this._helperDisplayed = false;
    }

    get gridSquareSize(): number {
        return this._gridSquareSize;
    }

    // Get the factor of conversion from pixels to centimeters
    get conversionFactor(): number {
        return this._gridSquareSize;
    }

    get helperDisplayed(): boolean {
        return this._helperDisplayed;
    }

    set helperDisplayed(value: boolean) {
        this._helperDisplayed = value;
    }

    get minZoom(): number {
        return this._minZoom;
    }

    get maxZoom(): number {
        return this._maxZoom;
    }

    get snapMode(): boolean {
        return this._snapMode;
    }

    set snapMode(value: boolean) {
        this._snapMode = value;
    }

    get snapAngle(): number {
        return this.straightLineMode ? Math.PI / 2 : Math.PI / this._snapRadiantFactor;
    }

    get snapAngleMode(): boolean {
        return this._snapAngleMode;
    }

    set snapAngleMode(value: boolean) {
        this._snapAngleMode = value;
    }

    get straightLineMode(): boolean {
        return this._straightLineMode;
    }

    set straightLineMode(value: boolean) {
        this._straightLineMode = value;
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

    get snapRadiantFactor(): number {
        return this._snapRadiantFactor;
    }

    set snapRadiantFactor(value: number) {
        this._snapRadiantFactor = value;
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

    helperOn(): void {
        this._helperDisplayed = !this._helperDisplayed;
    }

    changeSnapAngleMode(): void {
        this._snapAngleMode = !this._snapAngleMode;
    }

    get canvasName(): string {
        return this._canvasName;
    }

    set canvasName(value: string) {
        this._canvasName = value;
    }

    get allCanvasNames(): string[] {
        return this._allCanvasNames;
    }

    set allCanvasNames(names: string[]) {
        this._allCanvasNames = names;
    }

    addCanvasName(value: string): void {
        this.canvasName = value;
        this._allCanvasNames.push(value);
    }
}