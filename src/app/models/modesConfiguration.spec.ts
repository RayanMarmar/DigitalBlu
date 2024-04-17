import {ModesConfiguration} from './modesConfiguration';

describe('ModesConfiguration', () => {
    let config: ModesConfiguration;

    beforeEach(() => {
        config = new ModesConfiguration();
    });

    it('should initialize with default values', () => {
        expect(config.snapMode).toBe(true);
        expect(config.lineMode).toBe(true);
        expect(config.wallMode).toBe(false);
        expect(config.doorMode).toBe(false);
        expect(config.windowMode).toBe(false);
        expect(config.drawing).toBe(false);
        expect(config.gridOn).toBe(true);
        expect(config.defaultThickness).toBe(20);
        expect(config.zoomLevel).toBe(100);
        expect(config.darkMode).toBe(false);
        expect(config.grabMode).toBe(false);
        expect(config.cursorMode).toBe(false);
    });

    it('should change snap mode', () => {
        config.changeSnapMode();
        expect(config.snapMode).toBe(false);
        config.changeSnapMode();
        expect(config.snapMode).toBe(true);
    });

    it('should change dark mode', () => {
        config.changeDarkMode();
        expect(config.darkMode).toBe(true);
        config.changeDarkMode();
        expect(config.darkMode).toBe(false);
    });

    it('should change default thickness', () => {
        const newThickness = 30;
        config.changeDefaultThickness(newThickness);
        expect(config.defaultThickness).toBe(newThickness);
    });

    it('should change wall mode', () => {
        config.changeWallMode();
        expect(config.wallMode).toBe(true);
    });

    it('should change line mode', () => {
        config.changeLineMode();
        expect(config.lineMode).toBe(true);
    });

    it('should change door mode', () => {
        config.changeDoorMode();
        expect(config.doorMode).toBe(true);
    });

    it('should change window mode', () => {
        config.changeWindowMode();
        expect(config.windowMode).toBe(true);
    });

    it('should change grid mode', () => {
        config.changeGridMode();
        expect(config.gridOn).toBe(false);
        config.changeGridMode();
        expect(config.gridOn).toBe(true);
    });

    it('should change cursor mode', () => {
        config.changeCursorMode();
        expect(config.cursorMode).toBe(true);
        expect(config.grabMode).toBe(false);
        expect(config.doorMode).toBe(false);
        expect(config.wallMode).toBe(false);
        expect(config.lineMode).toBe(false);
        expect(config.windowMode).toBe(false);
    });

    it('should change grab mode', () => {
        config.changeGrabMode();
        expect(config.grabMode).toBe(true);
        expect(config.cursorMode).toBe(false);
        expect(config.doorMode).toBe(false);
        expect(config.wallMode).toBe(false);
        expect(config.lineMode).toBe(false);
        expect(config.windowMode).toBe(false);
    });
});
