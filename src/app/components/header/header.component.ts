import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {CanvasService} from "../../services/canvas.service";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        NgIf
    ],
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
        // public wall: Wall,
    ) {
        this.optionsDropped = false;
        // const initialThickness = this.getThickness();
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

    /*updateThickness(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.wall.changeWidth(Number(value));
    }

    getThickness() {
        return this.wall.width;
    }*/


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
