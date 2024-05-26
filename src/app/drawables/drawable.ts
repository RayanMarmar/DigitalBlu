interface Drawable {
    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        drawableColor: string,
        conversionFactor: number,
        transformationMatrix: number[][],
    ): void;

    toString(): String;

    shiftElement(x: number, y: number): void;

    equals(drawable: Drawable): boolean;

    shiftExtremity(extremity: Drawable, x: number, y: number): void;

    transform(transformationMatrix: number[][]): Drawable;
}