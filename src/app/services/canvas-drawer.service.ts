import {Injectable} from '@angular/core';
import {Point} from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class CanvasDrawerService {

    constructor() {
    }

    drawQad(context: CanvasRenderingContext2D, points: Point[], fillColor: string = "black") {
        if (points.length != 4)
            throw new Error("A quad should have exactly four points")
        // Draw a filled rectangle with the correct coordinates
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < 4; i++)
            context.lineTo(points[i].x, points[i].y);
        context.closePath();
        context.fillStyle = fillColor;
        context.fill();
        context.strokeStyle = fillColor;
        context.stroke(); // If you want to keep the border, you can include this line
        context.fillStyle = "black";
        context.strokeStyle = "black";
    }
}
