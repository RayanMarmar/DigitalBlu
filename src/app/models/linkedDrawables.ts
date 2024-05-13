import {Injectable} from "@angular/core";
import {Point} from "../drawables/point";
import {Line} from "../drawables/line";
import {Wall} from "../drawables/wall";

@Injectable({
    providedIn: 'root',
})
export class LinkedDrawables {
    private dictionary: { [key: string]: Drawable[] } = {};

    constructor() {
    }

    set(point: Point, drawables: Drawable[]): void {
        this.dictionary[point.serialize()] = drawables;
    }

    get(point: Point): Drawable[] {
        return this.dictionary[point.serialize()];
    }

    addDrawable(point: Point, drawable: Drawable): void {
        const serializedPoint: string = point.serialize();
        if (!this.dictionary[serializedPoint]) {
            this.dictionary[serializedPoint] = [];
        }
        this.dictionary[serializedPoint].push(drawable);
    }

    removeDrawable(point: Point, drawable: Drawable): void {
        const serializedPoint: string = point.serialize();
        if (!this.dictionary[serializedPoint]) {
            console.error('No drawables found for key ' + serializedPoint);
            return;
        }
        let index = this.findIndex(this.dictionary[serializedPoint], drawable);
        if (index == -1) {
            console.error('The drawable' + drawable.toString() + ' not found for key ' + serializedPoint);
            return;
        }
        this.dictionary[serializedPoint].splice(index, 1);

        // If the drawable array becomes empty, delete the key
        if (this.dictionary[serializedPoint].length === 0) {
            delete this.dictionary[serializedPoint];
        }
    }

    findIndex(drawables: Drawable[], drawable: Drawable): number {
        for (let i = 0; i < drawables.length; i++) {
            if (drawable.equals(drawables[i])) {
                return i;
            }
        }

        return -1;
    }

    keys(): Point[] {
        return Object.keys(this.dictionary).map(serializedPoint => Point.deserialize(serializedPoint));
    }

    unlinkDrawable(drawable: Drawable): void {
        if (drawable instanceof Line) {
            this.removeDrawable(drawable.firstPoint, drawable);
            this.removeDrawable(drawable.secondPoint, drawable);

        } else if (drawable instanceof Wall) {
            this.removeDrawable(drawable.fourthLine.calculateCenter(), drawable);
            this.removeDrawable(drawable.secondLine.calculateCenter(), drawable);
        }
    }

    linkDrawable(drawable: Drawable): void {
        if (drawable instanceof Line) {
            this.addDrawable(drawable.firstPoint, drawable);
            this.addDrawable(drawable.secondPoint, drawable);

        } else if (drawable instanceof Wall) {
            this.addDrawable(drawable.fourthLine.calculateCenter(), drawable);
            this.addDrawable(drawable.secondLine.calculateCenter(), drawable);
        }
    }
}