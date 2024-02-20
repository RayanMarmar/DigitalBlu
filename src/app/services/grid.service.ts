import {Injectable} from '@angular/core';
import {GridComponent} from "../components/grid/grid.component";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";
import {Point} from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class GridService {

    private gridComponent: GridComponent | null = null;

    constructor(
        private mouse: Mouse,
        private modesConfiguration: ModesConfiguration
    ) {
        this.mouse = mouse;
        this.modesConfiguration = modesConfiguration;
    }

    setGridComponent(gridComponent: GridComponent): void {
        this.gridComponent = gridComponent;
    }

    getGridComponent(): GridComponent | null {
        return this.gridComponent;
    }

    setGridVisible(): void {
        if (this.gridComponent instanceof GridComponent) {
            this.gridComponent.hideShowGrid();
        }
    }

    //Method Used to get nearest intersection for snapping point to grid
    calculateNearestGridIntersection(point: Point): Point {
        if (this.gridComponent != null) {
            const gridSize = this.gridComponent.squareSize * this.gridComponent.zoomLevel; // Adjust grid size based on zoom level

            // Calculate the nearest intersection coordinates
            point.x = Math.round(point.x / gridSize) * gridSize;
            point.y = Math.round(point.y / gridSize) * gridSize;

            return point;
        }
        return point;
    }

}
