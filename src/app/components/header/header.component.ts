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
    thickness: number = this.getThickness();
    lastValidThickness: number = this.modesConfiguration.defaultThickness;
    nameModalOpened: boolean = false;
    canvasNameInput: string = '';
    selectedCanvas: string = '';
    canvasSelectorOpened: boolean = false;
    isCanvasNameTaken: boolean = false;
    isCanvasNameEmpty: boolean = false;

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
            this.modesConfiguration.changeDefaultThickness(value);
        } else {
            // If negative value, revert to the last valid thickness
            this.modesConfiguration.changeDefaultThickness(this.lastValidThickness);
            this.thickness = this.lastValidThickness;
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

    onInput() {
        if (this.thickness < 1) {
            this.thickness = this.lastValidThickness;
        } else {
            this.lastValidThickness = this.thickness;
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

    getThickness() {
        return this.modesConfiguration.defaultThickness;
    }

    saveState(): void {
        if (this.modesConfiguration.canvasName == "") {
            this.openModal();
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
        this.nameModalOpened = false;
    }

    openModal(): void {
        this.nameModalOpened = true;
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
}
