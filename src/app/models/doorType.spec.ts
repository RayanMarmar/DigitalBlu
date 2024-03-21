import {DoorType} from './doorType';

describe('DoorType', () => {
    it('should have correct enum values', () => {
        expect(DoorType.OPEN_LEFT).toEqual(0);
        expect(DoorType.OPEN_RIGHT).toEqual(1);
        expect(DoorType.OPEN_TWO_WAY).toEqual(2);
    });
});
