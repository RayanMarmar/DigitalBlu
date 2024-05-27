import {Point} from './point';
import {Wall} from './wall';
import {Window} from './window';

describe('Window', () => {
    let windowInstance: Window;
    let wall: Wall;
    let point: Point;

    beforeEach(() => {
        const firstPoint = new Point(0, 0);
        const secondPoint = new Point(50, 0);
        const thirdPoint = new Point(50, 100);
        const fourthPoint = new Point(0, 100);
        wall = new Wall(firstPoint, secondPoint, 100);
        point = new Point(25, 50);
        windowInstance = new Window(wall, point);
    });

    it('should create a Window instance', () => {
        expect(windowInstance).toBeDefined();
    });

    it('should have the correct properties', () => {
        expect(windowInstance.line).toBeDefined();
        expect(windowInstance.parallelLine).toBeDefined();
        expect(windowInstance.center).toBeDefined();
    });
    
});
