import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TransformationService {

    constructor() {
    }

    getScalingMatrix(percentageScale: number): number[][] {
        // Convert percentage scale to decimal scale
        const scale = percentageScale / 100;

        // Formulate the scaling matrix
        return [
            [scale, 0],
            [0, scale]
        ];
    }

}
