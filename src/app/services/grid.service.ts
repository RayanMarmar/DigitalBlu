import {Injectable} from '@angular/core';
import {GridComponent} from "../components/grid/grid.component";
import {ModesConfiguration} from "../models/modesConfiguration";
import {Point} from "../drawables/point";

@Injectable({
    providedIn: 'root'
})
export class GridService {

    #gridComponent: GridComponent | null = null;

    constructor(
        private modesConfiguration: ModesConfiguration
    ) {
    }

    set gridComponent(gridComponent: GridComponent) {
        this.#gridComponent = gridComponent;
    }

    get gridComponent(): GridComponent | null {
        return this.#gridComponent;
    }

    //Method Used to get nearest intersection for snapping point to grid
    calculateNearestGridIntersection(point: Point): Point {
        if (this.gridComponent != null) {
            const gridSize = this.gridComponent.squareSize * this.modesConfiguration.zoomLevel / 100; // Adjust grid size based on zoom level

            // Calculate the nearest intersection coordinates
            let x = Math.round(point.x / gridSize) * gridSize;
            let y = Math.round(point.y / gridSize) * gridSize;


            return new Point(x, y);
        }
        return point;
    }

    updateCanvas() {
        this.gridComponent?.updateCanvas()
    }
}
