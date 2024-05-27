import {Point} from './point';

describe('Point', () => {
    let point: Point;

    beforeEach(() => {
        point = new Point(10, 20);
    });

    it('should initialize correctly', () => {
        expect(point.x).toEqual(10);
        expect(point.y).toEqual(20);
    });

    it('should set x coordinate correctly', () => {
        point.x = 30;
        expect(point.x).toEqual(30);
    });

    it('should set y coordinate correctly', () => {
        point.y = 40;
        expect(point.y).toEqual(40);
    });

    it('should check equality with another point correctly', () => {
        const samePoint = new Point(10, 20);
        const differentPoint = new Point(30, 40);

        expect(point.equals(samePoint)).toBeTruthy();
        expect(point.equals(differentPoint)).toBeFalsy();
    });

    it('should check if a point is within range correctly', () => {
        const inRangePoint = new Point(13, 22);
        const outOfRangePoint = new Point(30, 40);

        expect(point.inPointRange(inRangePoint)).toBeTruthy();
        expect(point.inPointRange(outOfRangePoint)).toBeFalsy();
    });

    it('should convert to string correctly', () => {
        expect(point.toString()).toEqual('(x = 10, y = 20)');
    });
});
