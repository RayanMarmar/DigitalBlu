interface Drawable {
    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        drawableColor: string,
        conversionFactor: number,
        transformationMatrix: number[][],
    ): void;

    toString(): String;

    equals(drawable: Drawable): boolean;

    transform(transformationMatrix: number[][]): Drawable;
}