import {Door} from './door';
import {DoorType} from './doorType';
import {Point} from './point';
import {Wall} from './wall';
import {Line} from './line';

describe('Door', () => {
    let door: Door;
    let wall: Wall;
    let point: Point;
    let line: Line;

    beforeEach(() => {
        wall = new Wall(new Point(10, 10), new Point(10, 15), 10);
        point = new Point(50, 100);
        line = new Line(point, point);
        door = new Door(wall, point);
    });

    it('should be created', () => {
        expect(door).toBeTruthy();
    });

    it('should have default door type', () => {
        expect(door.doorType).toBe(DoorType.OPEN_LEFT);
    });

    it('should update door type', () => {
        door.updateDoorType(DoorType.OPEN_RIGHT);
        expect(door.doorType).toBe(DoorType.OPEN_RIGHT);
    });

    it('should update door direction', () => {
        door.updateDoorDirection(-1);
        expect(door.direction).toBe(-1);
    });

    it('should not throw error for invalid door type update', () => {
        // Expecting that the updateDoorType method does not throw an error
        expect(() => {
            door.updateDoorType(null as any);
        }).not.toThrowError();
    });


});
