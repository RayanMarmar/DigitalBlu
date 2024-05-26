import {Component} from '@angular/core';
import {CanvasService} from "../../services/canvas.service";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ThemeService} from "../../services/theme.service";
import {ArchiveService} from "../../services/archive.service";
import {EventHandlerConfiguration} from "../../models/eventHandlerConfiguration";
import {SaveService} from "../../services/save.service";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        NgForOf
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    private thicknessInput: number = this.modesConfiguration.defaultThickness;
    lastValidThickness: number = this.modesConfiguration.defaultThickness;
    private unitValueInput: number = this.modesConfiguration.gridUnitValue;
    lastValidUnitValue: number = this.modesConfiguration.gridUnitValue;
    canvasNameInput: string = '';
    selectedCanvas: string = '';
    canvasSelectorOpened: boolean = false;
    isCanvasNameTaken: boolean = false;
    isCanvasNameEmpty: boolean = false;
    private _displayDimensionsOnInput: boolean = this.modesConfiguration.displayDimensionsOn;

    constructor(
        protected canvasService: CanvasService,
        protected modesConfiguration: ModesConfiguration,
        public eventHandlerConfiguration: EventHandlerConfiguration,
        private themeService: ThemeService,
        private archiveService: ArchiveService,
        private saveService: SaveService
    ) {
        this.selectedCanvas = modesConfiguration.canvasName;
    }

    // Getter for the radio button value
    get displayDimensionsOnInput(): string {
        return this._displayDimensionsOnInput ? 'yes' : 'no';
    }

    // Setter for the radio button value
    set displayDimensionsOnInput(value: string) {
        this._displayDimensionsOnInput = (value === 'yes');
    }

    switchSnapMode() {
        this.modesConfiguration.changeSnapMode();
    }

    undo() {
        this.canvasService.undo();
    }

    redo() {
        this.canvasService.redo();
    }

    switchWallMode() {
        this.eventHandlerConfiguration.setWallMode();
    }

    switchLineMode() {
        this.eventHandlerConfiguration.setLineMode();
    }

    switchDoorMode() {
        this.eventHandlerConfiguration.setDoorMode();
    }

    updateThickness(event: Event) {
        const value = Number((event.target as HTMLInputElement).value);
        if (value >= 0) {
            this.lastValidThickness = value;
        } else {
            this.thicknessInput = this.lastValidThickness;
        }
    }

    updateUnitValue(event: Event) {
        const value = Number((event.target as HTMLInputElement).value);
        if (value >= 0) {
            this.lastValidUnitValue = value;
        } else {
            this.unitValueInput = this.lastValidUnitValue;
        }
    }

    switchWindowMode() {
        this.eventHandlerConfiguration.setWindowMode();
    }

    switchGridMode() {
        this.modesConfiguration.changeGridMode();
    }

    switchDarkMode() {
        this.modesConfiguration.changeDarkMode();
        this.themeService.toggleDarkMode(this.modesConfiguration.darkMode)
        this.canvasService.drawAll();
    }

    switchEraseMode(): void {
        this.eventHandlerConfiguration.setEraseMode();
    }

    clearCanvas(): void {
        this.archiveService.clearCanvas()
        this.canvasService.drawAll();
    }

    onThicknessInput() {
        if (this.thicknessInput < 1) {
            this.thicknessInput = this.lastValidThickness;
        } else {
            this.lastValidThickness = this.thicknessInput;
        }
    }

    onUnitValueInput() {
        if (this.unitValueInput < 1) {
            this.unitValueInput = this.lastValidUnitValue;
        } else {
            this.lastValidUnitValue = this.unitValueInput;
        }
    }

    onCanvasChange(event: Event) {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.archiveService.clearCanvas()
        if (selectedValue === 'null') {
            this.selectedCanvas = "";
        } else {
            this.saveService.getCanvasState(this.archiveService, selectedValue);
        }
        this.modesConfiguration.canvasName = this.selectedCanvas;
        this.canvasService.drawAll();
    }

    redoDisabled(): boolean {
        return !this.archiveService.containsArchivedElements();
    }

    undoDisabled(): boolean {
        return !this.archiveService.containsElements();
    }

    switchCursorMode(): void {
        this.eventHandlerConfiguration.setCursorMode();
    }

    switchGrabMode(): void {
        this.eventHandlerConfiguration.setGrabMode();
    }

    saveState(): void {
        if (!this.modesConfiguration.checkSave()) {
            return;
        }

        this.archiveService.upToDate = true;
        this.saveService.saveState(this.modesConfiguration.canvasName);
    }

    canSave(): boolean {
        return !this.archiveService.upToDate;
    }

    saveCanvasName(): void {
        if (this.canvasNameInput && this.canvasNameInput.trim() !== '') {
            if (this.modesConfiguration.allCanvasNames.includes(this.canvasNameInput)) {
                this.isCanvasNameEmpty = false;
                this.isCanvasNameTaken = true;
            } else {
                this.modesConfiguration.addCanvasName(this.canvasNameInput);
                this.saveService.saveState(this.modesConfiguration.canvasName);
                this.closeModal();
            }
        } else {
            this.isCanvasNameTaken = false;
            this.isCanvasNameEmpty = true;
        }
    }


    closeModal(): void {
        this.canvasNameInput = "";
        this.isCanvasNameTaken = false;
        this.isCanvasNameEmpty = false;
        this.modesConfiguration.nameModalOpened = false;
    }

    displayHelper(): void {
        this.modesConfiguration.helperOn();
    }

    changeAngleSnapMode(): void {
        this.modesConfiguration.changeSnapAngleMode();
    }

    openCanvasSelector() {
        this.selectedCanvas = this.modesConfiguration.canvasName;
        this.canvasSelectorOpened = !this.canvasSelectorOpened;
    }

    cancelGlobalValues(): void {
        this.lastValidThickness = this.thicknessInput = this.modesConfiguration.defaultThickness;
        this.lastValidUnitValue = this.unitValueInput = this.modesConfiguration.gridUnitValue;
        this._displayDimensionsOnInput = this.modesConfiguration.displayDimensionsOn;
        this.modesConfiguration.toggleGlobalValuesModal();
    }

    saveGlobalValues(): void {
        this.modesConfiguration.changeDefaultThickness(this.lastValidThickness);
        this.modesConfiguration.gridUnitValue = this.lastValidUnitValue;
        this.modesConfiguration.displayDimensionsOn = this._displayDimensionsOnInput;
        this.modesConfiguration.toggleGlobalValuesModal();
    }
}
