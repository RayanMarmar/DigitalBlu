import {Injectable} from '@angular/core';
import {GridComponent} from "../components/grid/grid.component";
import {Point} from "../drawables/point";
import {TransformationService} from "./transformation.service";

@Injectable({
    providedIn: 'root'
})
export class GridService {

    #gridComponent: GridComponent | null = null;

    constructor(
        private transformationService: TransformationService
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
            const gridSize = this.gridComponent.squareSize * this.transformationService.scaleValue; // Adjust grid size based on zoom level
            let xDelta = (this.transformationService.transformationMatrix[0][2]) % gridSize;
            let yDelta = (this.transformationService.transformationMatrix[1][2]) % gridSize;

            // Calculate the nearest intersection coordinates
            let x = Math.round(point.x / gridSize) * gridSize + xDelta;
            let y = Math.round(point.y / gridSize) * gridSize + yDelta;


            return new Point(x, y);
        }
        return point;
    }

    updateCanvas() {
        this.gridComponent?.updateCanvas()
    }
}
