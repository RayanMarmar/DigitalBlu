import {Wall} from './wall';
import {Point} from './point';
import {Line} from './line';
import {wallOpening} from './wallOpening';

describe('wallOpening', () => {
    let wallOpeningInstance: wallOpening;
    let wall: Wall;
    let point: Point;
    let center: Point;

    beforeEach(() => {
        const firstPoint = new Point(0, 0);
        const secondPoint = new Point(50, 0);
        const thirdPoint = new Point(50, 100);
        const fourthPoint = new Point(0, 100);
        wall = new Wall(firstPoint, secondPoint, 100);
        point = new Point(25, 50);
        center = firstPoint;
        wallOpeningInstance = new wallOpening(wall, point);
    });

    it('should create a wallOpening instance', () => {
        expect(wallOpeningInstance).toBeDefined();
    });

    it('should correctly initialize the wallOpening properties', () => {
        expect(wallOpeningInstance.line).toBeInstanceOf(Line);
        expect(wallOpeningInstance.parallelLine).toBeInstanceOf(Line);
        expect(wallOpeningInstance.center).toBeInstanceOf(Point);
    });
    
});
