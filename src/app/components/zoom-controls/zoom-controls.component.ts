import {Component} from '@angular/core';


@Component({
    selector: 'app-zoom-controls',
    standalone: true,
    imports: [],
    templateUrl: './zoom-controls.component.html',
    styleUrl: './zoom-controls.component.css'
})
export class ZoomControlsComponent {
    zoomLevel: number = 100;


    zoomIn() {
        this.zoomLevel += 10;
        // Add logic to update your grid or canvas with the new zoom level
    }

    zoomOut() {
        this.zoomLevel -= 10;
        // Add logic to update your grid or canvas with the new zoom level
    }

}
