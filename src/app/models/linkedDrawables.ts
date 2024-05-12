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
        const serializedPoint = point.serialize();
        if (!this.dictionary[serializedPoint]) {
            this.dictionary[serializedPoint] = [];
        }
        this.dictionary[serializedPoint].push(drawable);
    }
}