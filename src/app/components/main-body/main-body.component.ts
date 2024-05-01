import {Component, HostListener} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {CanvasComponent} from "../canvas/canvas.component";
import {GridComponent} from "../grid/grid.component";
import {ModesConfiguration} from "../../models/modesConfiguration";
import {ZoomControlsComponent} from "../zoom-controls/zoom-controls.component";
import {HelperComponent} from "../helper/helper.component";
import {EventHandlerConfiguration} from "../../models/eventHandlerConfiguration";
import {CanvasService} from "../../services/canvas.service";

@Component({
    selector: 'app-main-body',
    standalone: true,
    imports: [HeaderComponent, CanvasComponent, GridComponent, ZoomControlsComponent, HelperComponent],
    templateUrl: './main-body.component.html',
    styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent {

    constructor(
        public modesConfiguration: ModesConfiguration,
        public eventHandlerConfiguration: EventHandlerConfiguration,
        private canvasService: CanvasService,
    ) {
    }


    @HostListener('document:keydown', ['$event'])
    private handleKeyDown(event: KeyboardEvent): void {
        this.eventHandlerConfiguration.onKeyDown(event);
        this.canvasService.drawAll();
    }
}
