interface Drawable {
    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        drawableColor: string,
        transformationMatrix: number[][],
    ): void;

    toString(): String;

    shiftElement(x: number , y : number): void;
}