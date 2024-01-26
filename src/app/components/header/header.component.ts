import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {CanvasService} from "../../services/canvas.service";
import {ModesConfiguration} from "../../models/modesConfiguration";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    @ViewChild('optionsButton', {static: true}) private optionsButton!: ElementRef;
    @ViewChild('optionsDropdown', {static: true}) private optionsDropdown!: ElementRef;
    private optionsDropped: boolean;

    constructor(
        private canvasService: CanvasService,
        public modesConfiguration: ModesConfiguration,
    ) {
        this.optionsDropped = false;
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

    displayGrid() {
        this.modesConfiguration.changeGridMode();
    }


    onOptionsClicked(): void {
        this.optionsDropdown.nativeElement.style.display = this.optionsDropped ? 'none' : 'block';
        this.optionsDropped = !this.optionsDropped;
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: Event): void {
        if (this.optionsDropped
            && event.target !== this.optionsButton.nativeElement
            && event.target !== this.optionsButton.nativeElement.firstChild
            && !this.optionsDropdown.nativeElement.contains(event.target)) {
            this.optionsDropdown.nativeElement.style.display = 'none';
            this.optionsDropped = false;
        }
    }

    protected readonly CanvasComponent = CanvasComponent;
}
