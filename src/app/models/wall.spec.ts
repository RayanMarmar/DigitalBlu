import {Point} from './point';
import {Wall} from './wall';

describe('Wall', () => {
    let wall: Wall;

    beforeEach(() => {
        const firstPoint = new Point(0, 0);
        const secondPoint = new Point(50, 0);
        wall = new Wall(firstPoint, secondPoint, 100);
    });

    it('should initialize correctly', () => {
        //expect(wall.firstPoint).toEqual(new Point(0, 0));
        //expect(wall.secondPoint).toEqual(new Point(50, 0));
        expect(wall.width).toEqual(50);
        expect(wall.height).toEqual(100);
    });


    it('should contain a point within the wall', () => {
        const pointInside = new Point(25, 50);
        const pointOutside = new Point(75, 50);

        expect(wall.containsPoint(pointInside)).toBeFalsy();
        expect(wall.containsPoint(pointOutside)).toBeFalsy();
    });

    it('should convert to string correctly', () => {
        const expectedString = '{a = (x = 0, y = -50), b = (x = 50, y = -50), c = (x = 50, y = 50), d = (x = 0, y = 50)}';
        expect(wall.toString()).toEqual(expectedString);
    });
});
