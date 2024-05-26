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
            // Adjust cursor position based on reverse transformation
            let originalPoint = point.reverseTransform(this.transformationService.reverseTransformationMatrix);

            // Find the nearest grid line in the x direction
            const nearestX = Math.round(originalPoint.x / this.gridComponent.squareSize) * this.gridComponent.squareSize;
            // Find the nearest grid line in the y direction
            const nearestY = Math.round(originalPoint.y / this.gridComponent.squareSize) * this.gridComponent.squareSize;

            // Create the snapped point in the transformed coordinate system
            let snappedPoint = new Point(nearestX, nearestY);

            // Transform the snapped point back to the original coordinate system
            return snappedPoint.transform(this.transformationService.transformationMatrix);
        }
        return point;
    }

    updateCanvas() {
        this.gridComponent?.updateCanvas()
    }
}
