import {Point} from "./point";
import "./drawable";

export class Line implements Drawable {
    private _firstPoint: Point;
    private _secondPoint: Point;

    constructor(
        firstPoint: Point,
        secondPoint: Point,
        reverseTransformationMatrix: number[][] = [[1, 1, 0], [1, 1, 0]],
    ) {
        this._firstPoint = firstPoint.reverseTransform(reverseTransformationMatrix);
        this._secondPoint = secondPoint.reverseTransform(reverseTransformationMatrix);
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

    private isVertical(): boolean {
        return this.firstPoint.x == this.secondPoint.x;
    }

    private isHorizontal(): boolean {
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
        return line.calculateDistance();
    }


    draw(
        context: CanvasRenderingContext2D,
        canvasColor: string,
        lineColor: string,
        conversionFactor: number,
        displayDimensions: boolean,
        transformationMatrix: number[][] = [[1, 0, 0], [0, 1, 0]],
    ): void {
        let line: Line = this.transform(transformationMatrix);
        context.beginPath();
        context.moveTo(line.firstPoint.x, line.firstPoint.y);
        context.lineTo(line.secondPoint.x, line.secondPoint.y);
        context.strokeStyle = lineColor;
        context.stroke();
        
        if (displayDimensions) {
            this.displayDimensions(context, line, lineColor, conversionFactor);
        }
    }

    displayDimensions(
        context: CanvasRenderingContext2D,
        line: Line,
        textColor: string,
        conversionFactor: number,
        offsetAboveLine: number = 15, // Offset for dimension text above the line
        fontSize: string = '12px Arial', // Font size and family for dimension text
    ): void {
        // Calculate angle of the line segment relative to the x-axis
        const angle = line.getAngleWithXVector();

        // Calculate the x and y offsets for the dimension text
        const xOffset = offsetAboveLine * Math.cos(angle + Math.PI / 2);
        const yOffset = offsetAboveLine * Math.sin(angle + Math.PI / 2);

        // Calculate position for displaying dimension text
        const center = line.calculateCenter();
        const dimensionX = center.x + xOffset;
        const dimensionY = center.y + yOffset;

        // Save the current context state
        context.save();

        // Translate to the position where the text should be drawn
        context.translate(dimensionX, dimensionY);

        // Rotate the canvas context to make the text parallel to the line
        // Adjust rotation to ensure text is not upside down
        const adjustedAngle = angle > Math.PI / 2 || angle < -Math.PI / 2 ? angle + Math.PI : angle;
        context.rotate(adjustedAngle);

        // Get the line dimension in centimeters
        const convertedDistance = this.calculateDistance() * conversionFactor;

        // Draw dimension text on canvas
        context.fillStyle = textColor; // Use line color for dimension text
        context.font = fontSize;
        context.textAlign = 'center';
        context.textBaseline = 'bottom'; // Align the text baseline to the bottom
        context.fillText(convertedDistance.toFixed(2), 0, 0); // Draw text at (0, 0)

        // Restore the context state to prevent affecting other drawings
        context.restore();
    }

    clone() : Line {
        return new Line(
            this._firstPoint.clone(),
            this._secondPoint.clone()
        );
    }

    transform(transformationMatrix: number[][]): Line {
        return new Line(this._firstPoint.transform(transformationMatrix), this._secondPoint.transform(transformationMatrix));
    }

    getAngleWithXVector(): number {
        // Calculate the difference in x and y coordinates
        const deltaX = this._secondPoint.x - this._firstPoint.x;
        const deltaY = this._secondPoint.y - this._firstPoint.y;

        // Calculate the angle in radians using Math.atan2
        return Math.atan2(deltaY, deltaX);
    }

    shiftElement(x: number, y: number): void {
        this._firstPoint.shiftElement(x, y);
        this._secondPoint.shiftElement(x, y);
    }

    equals(drawable: Drawable): boolean {
        return drawable instanceof Line
            && this._firstPoint.equals(drawable.firstPoint)
            && this._secondPoint.equals(drawable.secondPoint);
    }

    get extremities(): Point[] {
        return [this._firstPoint, this._secondPoint];
    }

    shiftExtremity(extremity: Point, x: number, y: number): void {
        if (extremity.equals(this._firstPoint)) {
            this._firstPoint.shiftElement(x, y);
        } else if (extremity.equals(this._secondPoint)) {
            this._secondPoint.shiftElement(x, y);
        }
    }
}
