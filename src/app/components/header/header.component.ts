import {Component, HostListener} from '@angular/core';
import {CanvasService} from "../../services/canvas.service";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ThemeService} from "../../services/theme.service";
import {ArchiveService} from "../../services/archive.service";

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
        private themeService: ThemeService,
        private archiveService: ArchiveService
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
        this.modesConfiguration.changeWallMode();
    }

    switchLineMode() {
        this.modesConfiguration.changeLineMode();
    }

    switchDoorMode() {
        this.modesConfiguration.changeDoorMode();
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
        console.log(this.lastValidThickness);
    }


    switchWindowMode() {
        this.modesConfiguration.changeWindowMode();
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
        this.modesConfiguration.changeEraseMode();
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
        this.modesConfiguration.changeCursorMode();
    }

    switchGrabMode(): void {
        this.modesConfiguration.changeGrabMode();
    }

    getThickness() {
        return this.modesConfiguration.defaultThickness;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey) {
            if (event.key === 'z') {
                this.undo();
            } else if (event.key === 'y') {
                this.redo();
            }
            event.preventDefault();
        }
    }
}
