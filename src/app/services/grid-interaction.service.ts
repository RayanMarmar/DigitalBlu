import {Injectable} from '@angular/core';
import {GridComponent} from "../components/grid/grid.component";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";

@Injectable({
    providedIn: 'root'
})
export class GridInteractionService {

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

    setGridVisible(gridComponent: GridComponent): void {
        gridComponent.hideShowGrid();
    }

}
