import {Point} from "./point";
import {Wall} from "./wall";
import {WallOpening} from "./wallOpening";
import "./drawable";
import {Line} from "./line";

export class Window extends WallOpening implements Drawable {
    constructor(wall: Wall, point: Point, height: number = 50) {
        super(wall, point, height);
    }

    override toString(): string {
        return "window : {firstLine : " + this._base[0].toString() + " secondLine : " + this._base[1].toString() + "}";
    }

    draw(context: CanvasRenderingContext2D, bgColor: string, wallColor: string, transformationMatrix: number[][]): void {
        let window: Window = this.transform(transformationMatrix);
        window.drawOpening(context, bgColor, wallColor);
    }


    transform(transformationMatrix: number[][]): Window {
        return new Window(
            this._wall.transform(transformationMatrix),
            this._base[0].calculateCenter().transform(transformationMatrix),
            this.height * transformationMatrix[0][0],
        );
    }

    shiftElement(x :number , y : number): void {
        let wallLength = this.wall.firstLine.calculateDistance();
        let center = this.wall.firstLine.calculateCenter();

        // Calculate new points after shifting
        let p1 = new Point(this.base[0].firstPoint.x + x, this.base[0].firstPoint.y + y);
        let p2 = new Point(this.base[0].secondPoint.x + x, this.base[0].secondPoint.y + y);


        let p3 = new Point(this.base[1].firstPoint.x + x, this.base[1].firstPoint.y + y);
        let p4 = new Point(this.base[1].secondPoint.x + x, this.base[1].secondPoint.y + y);


        let l1 = new Line(
            p1,
            this.wall.firstLine.secondPoint
        )
        let l2 = new Line(
            p2,
            this.wall.firstLine.firstPoint
        )

        let l3 = new Line(
            this.base[0].secondPoint,
            p4
        )
        let l4 = new Line(
            this.base[0].firstPoint,
            p3
        )
        console.log("here",l3.calculateDistance(),l4.calculateDistance())

        this.base[1].firstPoint.x += x
        this.base[1].firstPoint.y += y
        this.base[1].secondPoint.x += x
        this.base[1].secondPoint.y += y
    }
}