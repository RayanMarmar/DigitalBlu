import {Component} from '@angular/core';
import {CanvasService} from "../../services/canvas.service";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {NgIf} from "@angular/common";
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
        FormsModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    thickness: number = this.getThickness();
    lastValidThickness: number = this.modesConfiguration.defaultThickness;

    constructor(
        private canvasService: CanvasService,
        public modesConfiguration: ModesConfiguration,
        public eventHandlerConfiguration: EventHandlerConfiguration,
        private themeService: ThemeService,
        private archiveService: ArchiveService,
        private saveService: SaveService
    ) {
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

    onInput() {
        if (this.thickness < 1) {
            this.thickness = this.lastValidThickness;
        } else {
            this.lastValidThickness = this.thickness;
        }
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
        return this.saveService.saveState()
    }

    displayHelper(): void {
        this.modesConfiguration.helperOn();
    }

    changeAngleSnapMode(): void {
        this.modesConfiguration.changeSnapAngleMode();
    }
}
