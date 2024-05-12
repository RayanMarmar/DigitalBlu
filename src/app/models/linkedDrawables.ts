import {Injectable} from "@angular/core";
import {Point} from "../drawables/point";

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
        let index = this.dictionary[serializedPoint].indexOf(drawable);
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

    keys(): Point[] {
        return Object.keys(this.dictionary).map(serializedPoint => Point.deserialize(serializedPoint));
    }
}