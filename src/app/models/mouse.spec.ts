import {Mouse} from './mouse';
import {Point} from './point';

describe('Mouse', () => {
    let mouse: Mouse;

    beforeEach(() => {
        mouse = new Mouse();
    });

    it('should initialize correctly', () => {
        expect(mouse.moving).toBeFalse();
        expect(mouse.notFirstMouseMoveEvent).toBeFalse();
        expect(mouse.clickedCoordinates).toBeNull();
        expect(mouse.currentCoordinates).toBeNull();
        expect(mouse.canvasRect).toBeNull();
    });

    it('should set canvasRect correctly', () => {
        const rect = new Point(10, 20);
        mouse.canvasRect = rect;
        expect(mouse.canvasRect).toEqual(rect);
    });

    it('should set currentCoordinates from event correctly', () => {
        const canvasRect = new Point(100, 100);
        const event = createMouseEvent(150, 150);
        mouse.canvasRect = canvasRect;
        mouse.setCurrentCoordinatesFromEvent(event);
        expect(mouse.currentCoordinates).toEqual(new Point(50, 50));
    });

    it('should set canvasRect from DOMRect correctly', () => {
        const rect = new DOMRect(10, 20, 30, 40);
        mouse.setCanvasRectFromDomRect(rect);
        expect(mouse.canvasRect).toEqual(new Point(10, 20));
    });

    it('should handle mouseDown event correctly', () => {
        const canvasRect = new Point(100, 100);
        const event = createMouseEvent(150, 150);
        mouse.canvasRect = canvasRect;
        mouse.mouseDown(event);
        expect(mouse.moving).toBeFalse();
        expect(mouse.clickedCoordinates).toEqual(new Point(50, 50));
        expect(mouse.notFirstMouseMoveEvent).toBeFalse();
    });

    it('should handle mouseMove event correctly', () => {
        const canvasRect = new Point(100, 100);
        const event = createMouseEvent(150, 150);
        mouse.canvasRect = canvasRect;
        mouse.mouseMove(event);
        expect(mouse.moving).toBeTrue();
        expect(mouse.currentCoordinates).toEqual(new Point(50, 50));
    });

    function createMouseEvent(clientX: number, clientY: number): MouseEvent {
        const event = document.createEvent('MouseEvent');
        event.initMouseEvent(
            'mousemove', true, true, window, 0,
            clientX, clientY, clientX, clientY,
            false, false, false, false, 0, null
        );
        return event;
    }
});
