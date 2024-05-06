import {ElementRef, Injectable} from '@angular/core';
import {Line} from "../drawables/line";
import {ArchiveService} from "./archive.service";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";
import {TransformationService} from "./transformation.service";
import {ThemeService} from "./theme.service";

@Injectable({
    providedIn: 'root'
})
export class CanvasService {
    private canvas: ElementRef<HTMLCanvasElement> | null = null;
    private context: CanvasRenderingContext2D | null = null;
    private canvasRect: DOMRect | null = null;
    private _selectedElement: Drawable | null = null;

    constructor(
        private archiveService: ArchiveService,
        private transformationService: TransformationService,
        private themeService: ThemeService
    ) {
    }


    get selectedElement(): Drawable | null {
        return this._selectedElement;
    }

    set selectedElement(value: Drawable | null) {
        this._selectedElement = value;
    }

    setCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
        this.canvas = canvas;
        this.context = this.canvas.nativeElement.getContext("2d");
        this.canvasRect = canvas.nativeElement.getBoundingClientRect();
    }

    private drawAllLines(): void {
        this.archiveService.linesList.forEach((line: Line): void => {
            line.draw(
                this.context!!,
                this.themeService.getCanvasColor(),
                this.themeService.getDrawableColor(),
                this.transformationService.transformationMatrix,
            );
        });
    }

    updateCanvasRect(newValue: DOMRect): void {
        this.canvasRect = newValue;
    }

    private drawAllWalls(): void {
        this.archiveService.wallsList.forEach((wall: Wall): void => {
            wall.draw(
                this.context!!,
                this.themeService.getCanvasColor(),
                this.themeService.getDrawableColor(),
                this.transformationService.transformationMatrix,
            );
        });
    }

    private drawAllDoors(): void {
        this.archiveService.doorsList.forEach((door: Door): void => {
            door.draw(
                this.context!!,
                this.themeService.getCanvasColor(),
                this.themeService.getDrawableColor(),
                this.transformationService.transformationMatrix
            );
        });
    }

    private drawAllWindows(): void {
        this.archiveService.windowsList.forEach((window: Window): void => {
            window.draw(
                this.context!!,
                this.themeService.getCanvasColor(),
                this.themeService.getDrawableColor(),
                this.transformationService.transformationMatrix,
            );
        });
    }

    private highlightSelectedElement(): void {
        if (this.archiveService.selectedElement !== null) {
            this.archiveService.selectedElement.draw(
                this.context!!,
                this.themeService.getCanvasColor(),
                this.themeService.getDeleteDrawableColor(),
                this.transformationService.transformationMatrix,
            )
        }
    }

    drawAll(): void {
        if (this.context == null) {
            console.log("Context is null...")
            return;
        }
        this.clear();
        this.drawAllLines();
        this.drawAllWalls();
        this.drawAllDoors();
        this.drawAllWindows();
        this.highlightSelectedElement();

    }

    undo(): void {
        this.archiveService.undo();
        this.drawAll();
    }

    redo(): void {
        this.archiveService.redo();
        this.drawAll();
    }

    clear(): void {
        this.context!.clearRect(0, 0, this.canvasRect!.width, this.canvasRect!.height);
    }
}
