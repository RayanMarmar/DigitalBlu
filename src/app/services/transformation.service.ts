import {Injectable} from '@angular/core';
import {Point} from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class TransformationService {
    private initialMatrix: number[][];
    private scaleValue: number;
    private translationMatrix: number[];
    private _transformationMatrix: number[][];

    constructor() {
        this.initialMatrix = [
            [1, 0, 0],
            [0, 1, 0]
        ];
        this._transformationMatrix = [
            [1, 0, 0],
            [0, 1, 0]
        ];
        this.translationMatrix = [0, 0];
        this.scaleValue = 1;
    }

    scale(percentageScale: number) {
        this.scaleValue = percentageScale / 100;
        this.recomputeTransformationMatrix();
    }

    recomputeTransformationMatrix() {
        this._transformationMatrix[0][0] = this.initialMatrix[0][0] * this.scaleValue;
        this._transformationMatrix[1][1] = this.initialMatrix[1][1] * this.scaleValue;
        this._transformationMatrix[0][2] = this.translationMatrix[0];
        this._transformationMatrix[1][2] = this.translationMatrix[1];
    }

    get transformationMatrix(): number[][] {
        return this._transformationMatrix;
    }

    get reverseTransformationMatrix(): number[][] {
        return [
            [1 / this.transformationMatrix[0][0], 1 / this.transformationMatrix[0][1], -this.transformationMatrix[0][2]],
            [1 / this.transformationMatrix[1][0], 1 / this.transformationMatrix[1][1], -this.transformationMatrix[1][2]],
        ];
    }

    setTranslationMatrix(initialCursorPos: Point, currentCursorPos: Point, save: boolean = false) {
        const deltaX = currentCursorPos.x - initialCursorPos.x;
        const deltaY = currentCursorPos.y - initialCursorPos.y;

        // Update translation matrix
        this.translationMatrix[0] = this.initialMatrix[0][2] + deltaX;
        this.translationMatrix[1] = this.initialMatrix[1][2] + deltaY;
        if (save) {
            this.initialMatrix[0][2] = this.translationMatrix[0];
            this.initialMatrix[1][2] = this.translationMatrix[1];
        }
        this.recomputeTransformationMatrix();
    }
}
