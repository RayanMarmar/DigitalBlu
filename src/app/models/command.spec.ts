import {Command} from './command';

describe('Command', () => {
    it('should have correct values', () => {
        expect(Command.ADD_POINT).toBe('ADD_POINT');
        expect(Command.ADD_LINE).toBe('ADD_LINE');
        expect(Command.ADD_WALL).toBe('ADD_WALL');
        expect(Command.ADD_DOOR).toBe('ADD_DOOR');
        expect(Command.ADD_WINDOW).toBe('ADD_WINDOW');
    });
});
