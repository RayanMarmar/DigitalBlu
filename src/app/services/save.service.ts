import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {TransformationService} from "./transformation.service";
import {ModesConfiguration} from "../models/modesConfiguration";
import "../models/appState";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";

@Injectable({
    providedIn: 'root'
})

export class SaveService {
    private previousAppData: AppState | undefined;
    private darkMode: boolean | undefined;
    private canvasName: string | undefined;
    private allCanvasNames: string[] = [];

    constructor(
        private transformationService: TransformationService,
        private modeConfiguration: ModesConfiguration,
        private archiveService: ArchiveService,
    ) {
    }

    setCurrentAppState(): AppState {
        // Create the app state object
        return {
            currentCanvas: this.modeConfiguration.canvasName,
            theme: this.modeConfiguration.darkMode ? 'dark' : 'light',
            thickness: this.modeConfiguration.defaultThickness,
            canvases: this.previousAppData?.canvases ?? {}
        };
    }

    saveState(canvasName: string): void {
        const state = {
            linesList: this.archiveService.linesList.map(line => ({
                _firstPoint: {_x: line.firstPoint.x, _y: line.firstPoint.y},
                _secondPoint: {_x: line.secondPoint.x, _y: line.secondPoint.y}
            })),
            wallsList: this.archiveService.wallsList.map((wall) => ({
                _firstPoint: {_x: wall.fourthLine.calculateCenter().x, _y: wall.fourthLine.calculateCenter().y},
                _secondPoint: {_x: wall.secondLine.calculateCenter().x, _y: wall.secondLine.calculateCenter().y},
                _height: wall.height,
                _matrix: {_reverseTransformationMatrix: this.transformationService.reverseTransformationMatrix},
                _uid: wall.uid
            })),

            doorsList: this.archiveService.doorsList.map((door) => ({
                _uid: door.wall.uid,
                _point: {_x: door.base[0].calculateCenter().x, _y: door.base[0].calculateCenter().y},
                _doorType: door.doorType.valueOf(),
                _direction: door.direction,
                _width: door.width,
                _radius: door.radius
            })),
            windowsList: this.archiveService.windowsList.map(window => ({
                _uid: window.wall.uid,
                _point: {_x: window.base[0].calculateCenter().x, _y: window.base[0].calculateCenter().y},
                _width: window.width
            }))
        };

        // Store current state in cache
        let appState: AppState = this.setCurrentAppState();

        // Check if the canvas already exists
        if (appState.canvases && appState.canvases[canvasName]) {
            // Replace the old state with the new state
            appState.canvases[canvasName] = state;
        } else {
            // Create a new entry for the canvas
            appState.canvases = {...appState.canvases, [canvasName]: state};
        }

        localStorage.setItem('appState', JSON.stringify(appState)); // Save state
        console.log(localStorage.getItem('appState'))
    }

    getState(archive: ArchiveService) {
        const stateString = localStorage.getItem('appState');
        const appStateParsed = stateString ? JSON.parse(stateString) : null;
        if (appStateParsed == null) {
            return archive;
        }
        this.previousAppData = appStateParsed;
        this.canvasName = appStateParsed.currentCanvas;
        this.darkMode = appStateParsed.theme == "dark";
        this.allCanvasNames = Object.keys(appStateParsed.canvases);

        const currentCanvasState = appStateParsed.canvases[appStateParsed.currentCanvas];
        if (currentCanvasState) {
            // Individual assignment of attributes from the parsed state
            // SETTING LINES
            const linesList = currentCanvasState.linesList || [];
            linesList.map((lineData: any) => {
                let line = new Line(
                    new Point(lineData._firstPoint._x, lineData._firstPoint._y),
                    new Point(lineData._secondPoint._x, lineData._secondPoint._y)
                );
                this.archiveService.addLine(line, true);
            });

            // SETTING WALLS
            const wallsList = currentCanvasState.wallsList || [];
            wallsList.map((wallData: any) => {
                let wall: Wall = new Wall(
                    // Extract relevant data for constructing a Wall
                    new Point(wallData._firstPoint._x, wallData._firstPoint._y),
                    new Point(wallData._secondPoint._x, wallData._secondPoint._y),
                    wallData._height,
                    wallData._matrix._reverseTransformationMatrix,
                    wallData._uid
                );
                this.archiveService.addWall(wall, true);
            });

            // SETTING DOORS
            const doorsList = currentCanvasState.doorsList || [];
            archive.doorsList = doorsList.map((doorData: any) => {
                // Find the existing wall associated with the door

                let wall = archive.getWallByUid(doorData._uid)
                if (wall) {
                    return new Door(
                        wall, // Pass the existing wall
                        new Point(doorData._point._x, doorData._point._y),
                        doorData._doorType,
                        doorData._direction,
                        doorData._width,
                        doorData._radius
                    );
                } else {
                    // Handle case where wall is not found
                    console.error(`Wall with uid ${doorData._uid} not found.`);
                    return null; // or handle differently based on your use case
                }
            });

            // SETTING WINDOWS
            archive.windowsList = currentCanvasState.windowsList.map((windowData: any) => {

                let wall = archive.getWallByUid(windowData._uid)
                if (wall) {
                    return new Window(
                        wall, // Get wall reference from archive
                        new Point(windowData._point._x, windowData._point._y),
                        windowData._width
                    )
                } else {
                    // Handle case where wall is not found
                    console.error(`Wall with uid ${windowData._uid} not found.`);
                    return null; // or handle differently based on your use case
                }

            });

        }
        return archive;
    }

    getModeConfiguration(modeConf: ModesConfiguration): void {
        modeConf.darkMode = this.darkMode!
        modeConf.canvasName = this.canvasName!
        modeConf.allCanvasNames = this.allCanvasNames
    }

    clearState(): void {
        localStorage.removeItem('appState');
    }
}
