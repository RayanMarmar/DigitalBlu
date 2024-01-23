import {Component} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {CanvasComponent} from "../canvas/canvas.component";
import {GridComponent} from "../grid/grid.component";
import {ModesConfiguration} from "../../models/modesConfiguration";

@Component({
    selector: 'app-main-body',
    standalone: true,
    imports: [HeaderComponent, CanvasComponent, GridComponent],
    templateUrl: './main-body.component.html',
    styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent {

    constructor(public modesConfiguration: ModesConfiguration) {
    }
}
