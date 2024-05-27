import {Line} from './line';
import {Point} from './point';

describe('Line', () => {
    let line: Line;

    beforeEach(() => {
        // Initialize a new Line object before each test
        const firstPoint = new Point(0, 0);
        const secondPoint = new Point(100, 100);
        line = new Line(firstPoint, secondPoint);
    });

    it('should create a line with correct points', () => {
        expect(line.firstPoint).toEqual(new Point(0, 0));
        expect(line.secondPoint).toEqual(new Point(100, 100));
    });

    it('should calculate distance correctly', () => {
        expect(line.calculateDistance()).toBeCloseTo(141.42, 2); // Approximate value of square root of 20000
    });

    it('should calculate center correctly', () => {
        expect(line.calculateCenter()).toEqual(new Point(50, 50));
    });

    it('should calculate a parallel line correctly', () => {
        const parallelLine = line.calculateParallelLine(50, 1, 1);
        const firstpoint = new Point(75, 50);
        const secondpoint = new Point(75, 100);
        expect(parallelLine.calculateDistance()).toEqual(line.calculateDistance());
        expect(parallelLine.isOnLine(firstpoint)).toBe(false);
        expect(parallelLine.isOnLine(secondpoint)).toBe(false);
    });

    it('should calculate intersection with a point correctly', () => {
        const intersectionPoint = line.intersection(new Point(50, 50));
        expect(intersectionPoint).toEqual(new Point(50, 50));
    });

    it('should check if a point is on the line correctly', () => {
        // Point on the line
        expect(line.isOnLine(new Point(100, 100))).toBe(true);
        expect(line.isOnLine(new Point(130, 150))).toBe(false);
        expect(line.isOnLine(new Point(-13, -10))).toBe(false);
        expect(line.isOnLine(new Point(53, 60))).toBe(false);
    });


    it('should calculate intersection with a non-intersecting line correctly', () => {
        const nonIntersectingLine = new Line(new Point(200, 200), new Point(300, 300));
        const intersectionPoint = line.intersection(nonIntersectingLine.firstPoint);
        expect(intersectionPoint).toBeNull();
    });

    it('should calculate subLine correctly', () => {
        const subLine = line.subLine(new Point(50, 50), 50);
        // The subLine should be perpendicular to the original line and have a length of 50
        expect(subLine?.calculateDistance()).toEqual(50);
        // The subLine should intersect the original line at the given point
        expect(subLine?.isOnLine(new Point(50, 50))).toBe(true);
    });

    it('should calculate subLine as null when width is too large', () => {
        const subLine = line.subLine(new Point(50, 50), 150);
        expect(subLine).toBeNull();
    });

    it('should calculate subLine as null when point is not on the line', () => {
        const subLine = line.subLine(new Point(200, 200), 50);
        expect(subLine).toBeNull();
    });

});
