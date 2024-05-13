interface Drawable {
    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        drawableColor: string,
        transformationMatrix: number[][],
    ): void;

    toString(): String;

    equals(drawable: Drawable): boolean;
}