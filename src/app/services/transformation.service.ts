import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TransformationService {
    private initialMatrix: number[][];
    private scaleValue: number;
    private translationMatrix: number[][];
    private _transformationMatrix: number[][];

    constructor() {
        this.initialMatrix = [
            [1, 0],
            [0, 1]
        ];
        this._transformationMatrix = [
            [1, 0],
            [0, 1]
        ];
        this.translationMatrix = [
            [1, 1],
            [1, 1]
        ];
        this.scaleValue = 1;
    }

    scale(percentageScale: number) {
        this.scaleValue = percentageScale / 100;
        this.recomputeTransformationMatrix();
    }

    recomputeTransformationMatrix() {
        this._transformationMatrix[0][0] = this.initialMatrix[0][0] * this.scaleValue;
        this._transformationMatrix[1][1] = this.initialMatrix[1][1] * this.scaleValue;
    }

    get transformationMatrix(): number[][] {
        return this._transformationMatrix;
    }

    get reverseTransformationMatrix(): number[][] {
        return [
            [1 / this.transformationMatrix[0][0], 1 / this.transformationMatrix[0][1],],
            [1 / this.transformationMatrix[1][0], 1 / this.transformationMatrix[1][1],],
        ];
    }

}
