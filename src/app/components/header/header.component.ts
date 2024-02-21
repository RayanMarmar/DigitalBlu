import {Component} from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {CanvasService} from "../../services/canvas.service";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

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

    onInput() {
        if (this.thickness < 1) {
            this.thickness = this.lastValidThickness;
        } else {
            this.lastValidThickness = this.thickness;
        }
    }

    getThickness() {
        return this.modesConfiguration.defaultThickness;
    }


    protected readonly CanvasComponent = CanvasComponent;
}
