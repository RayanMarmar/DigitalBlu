import {Point} from "./point";
import "./drawable";

export class Line implements Drawable {
    private _firstPoint: Point;
    private _secondPoint: Point;

    constructor(firstPoint: Point, secondPoint: Point,
                reverseTransformationMatrix: number[][] = [[1, 1, 0], [1, 1, 0]],
    ) {
        this._firstPoint = firstPoint.transform(reverseTransformationMatrix);
        this._secondPoint = secondPoint.transform(reverseTransformationMatrix);
    }

    // Getter for firstPoint
    get firstPoint(): Point {
        return this._firstPoint;
    }

    // Setter for firstPoint
    set firstPoint(value: Point) {
        this._firstPoint = value;
    }

    // Getter for secondPoint
    get secondPoint(): Point {
        return this._secondPoint;
    }

    // Setter for secondPoint
    set secondPoint(value: Point) {
        this._secondPoint = value;
    }

    isLineExtremity(point: Point): boolean {
        return this._firstPoint.equals(point) || this._secondPoint.equals(point);
    }

    toString(): string {
        return "{a = " + this._firstPoint.toString() + ", b = " + this._secondPoint.toString() + "}";
    }

    calculateParallelLine(height: number, xFactor: number, yFactor: number, direction: number = 1): Line {
        const originalSlope: number = (this._secondPoint.y - this._firstPoint.y) / (this._secondPoint.x - this._firstPoint.x);

        if (originalSlope == 0) {
            return new Line(
                new Point(this._firstPoint.x, this._firstPoint.y + direction * height),
                new Point(this._secondPoint.x, this._secondPoint.y + direction * height)
            );
        }
        const perpendicularSlope: number = -1 / originalSlope;

        const offsetX: number = direction * Math.abs(height / Math.sqrt(1 + Math.pow(perpendicularSlope, 2)));
        const offsetY: number = direction * Math.abs(offsetX * perpendicularSlope);

        return new Line(
            new Point(this._firstPoint.x + offsetX * yFactor * -1, this._firstPoint.y + offsetY * xFactor),
            new Point(this._secondPoint.x + offsetX * yFactor * -1, this._secondPoint.y + offsetY * xFactor)
        );
    }

    calculateDistance(): number {
        return Math.sqrt(
            Math.pow(this._firstPoint.x - this._secondPoint.x, 2)
            + Math.pow(this._firstPoint.y - this._secondPoint.y, 2)
        );
    }

    calculateCenter(): Point {
        return new Point(
            (this._firstPoint.x + this._secondPoint.x) / 2,
            (this._firstPoint.y + this._secondPoint.y) / 2
        );
    }

    subLine(point: Point, width: number): Line | null {
        // Calculate the intersection point
        const intersectionPoint: Point | null = this.intersection(point);
        // Verify if the point of intersection is on the line
        if (
            intersectionPoint == null ||
            !this.isOnLine(intersectionPoint) ||
            new Line(intersectionPoint, this._firstPoint).calculateDistance() < width / 2 ||
            new Line(intersectionPoint, this._secondPoint).calculateDistance() < width / 2
        ) {
            return null;
        }

        // Calculate the coordinates of the points to form a segment with the given width
        const angle = Math.atan2(this._secondPoint.y - this._firstPoint.y, this._secondPoint.x - this._firstPoint.x);
        const offsetX = (width / 2) * Math.cos(angle);
        const offsetY = (width / 2) * Math.sin(angle);
        const point1 = new Point(intersectionPoint.x + offsetX, intersectionPoint.y + offsetY);
        const point2 = new Point(intersectionPoint.x - offsetX, intersectionPoint.y - offsetY);

        // Verify if these points are on the line
        if (!this.isOnLine(point1) || !this.isOnLine(point2)) {
            return null;
        }

        // Return the new segment
        return new Line(point2, point1);
    }

    intersection(point: Point): Point | null {
        if (this.isVertical()) {
            return new Point(this._firstPoint.x, point.y);
        } else if (this.isHorizontal()) {
            return new Point(point.x, this._firstPoint.y);
        }

        // Step 1: Calculate the slope of AB
        const slopeAB: number = (this._secondPoint.y - this._firstPoint.y) / (this._secondPoint.x - this._firstPoint.x);
        // Step 2: Calculate the negative reciprocal of the slope
        const slopePerpendicular: number = -1 / slopeAB;

        // Calculate the y-intercept of the perpendicular line passing through point C
        const interceptPerpendicular = point.y - slopePerpendicular * point.x;

        // Solve for x-coordinate of intersection point D
        const xIntersection = (interceptPerpendicular - this._firstPoint.y + slopeAB * this._firstPoint.x) / (slopeAB - slopePerpendicular);

        // Use x-coordinate to find y-coordinate of intersection point D
        const yIntersection = slopeAB * (xIntersection - this._firstPoint.x) + this._firstPoint.y;
        // Step 4: Check if the intersection point is within the line segment AB
        if (
            ((this._firstPoint.x <= xIntersection && xIntersection <= this._secondPoint.x) ||
                (this._secondPoint.x <= xIntersection && xIntersection <= this._firstPoint.x)) &&
            ((this._firstPoint.y <= yIntersection && yIntersection <= this._secondPoint.y) ||
                (this._secondPoint.y <= yIntersection && yIntersection <= this._firstPoint.y))
        ) {
            // Return the intersection point
            return new Point(xIntersection, yIntersection);
        } else {
            // Return null if the intersection point is outside the line segment
            return null;
        }
    }

    isOnLine(point: Point): boolean {
        // Check if the point is on the line using the equation of the line
        const slope = (this._secondPoint.y - this._firstPoint.y) / (this._secondPoint.x - this._firstPoint.x);

        // Avoid division by zero (vertical line)
        if (isFinite(slope)) {
            // Calculate the expected y-coordinate on the line for the given x-coordinate
            const expectedY = this._firstPoint.y + slope * (point.x - this._firstPoint.x);

            // Check if the actual y-coordinate of the point matches the expected y-coordinate
            return Math.abs(point.y - expectedY) < 0.0001; // You can adjust the epsilon for floating-point comparisons
        } else {
            // If the line is vertical, check if the x-coordinates match
            return Math.abs(point.x - this._firstPoint.x) < 0.0001;
        }
    }

    isVertical(): boolean {
        return this.firstPoint.x == this.secondPoint.x;
    }

    isHorizontal(): boolean {
        return this.firstPoint.y == this.secondPoint.y;
    }

    calculateNearestPointDistance(point: Point): number {
        // Step 1: Calculate the direction vector of the line
        const lineVector = new Point(this._secondPoint.x - this._firstPoint.x, this._secondPoint.y - this._firstPoint.y);

        // Step 2: Calculate the vector from the first point of the line to the given point
        const pointVector = new Point(point.x - this._firstPoint.x, point.y - this._firstPoint.y);

        // Step 3: Calculate the scalar projection of pointVector onto lineVector
        const scalarProjection = (lineVector.x * pointVector.x + lineVector.y * pointVector.y) / Math.pow(this.calculateDistance(), 2);

        // Step 4: Calculate the nearest point on the line
        let nearestPoint: Point;

        if (scalarProjection <= 0) {
            nearestPoint = this._firstPoint; // Nearest point is the first endpoint
        } else if (scalarProjection >= 1) {
            nearestPoint = this._secondPoint; // Nearest point is the second endpoint
        } else {
            nearestPoint = new Point(
                this._firstPoint.x + scalarProjection * lineVector.x,
                this._firstPoint.y + scalarProjection * lineVector.y
            );
        }
        let line = new Line(nearestPoint, point)

        // Step 5: Calculate the distance between the given point and the nearest point on the line
        return line.calculateDistance()
    }


    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        lineColor: string,
        transformationMatrix: number[][] = [[1, 0, 0], [0, 1, 0]],
    ): void {
        let line: Line = this.transform(transformationMatrix);
        context.beginPath();
        context.moveTo(line.firstPoint.x, line.firstPoint.y);
        context.lineTo(line.secondPoint.x, line.secondPoint.y);
        context.strokeStyle = lineColor;
        context.stroke();
    }

    transform(transformationMatrix: number[][]): Line {
        return new Line(this._firstPoint.transform(transformationMatrix), this._secondPoint.transform(transformationMatrix));
    }
}