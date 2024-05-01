import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {TransformationService} from "./transformation.service";
import {Wall} from "../drawables/wall";

@Injectable({
    providedIn: 'root'
})
export class SaveService {
    private _transformationService: TransformationService;

    constructor(transformationService: TransformationService) {
        this._transformationService = transformationService
    }


    get transformationService(): TransformationService {
        return this._transformationService;
    }

    set transformationService(value: TransformationService) {
        this._transformationService = value;
    }

    saveState(archive: ArchiveService): void {
        const state = {
            linesList: archive.linesList.map(line => ({
                _firstPoint: {_x: line.firstPoint.x, _y: line.firstPoint.y},
                _secondPoint: {_x: line.secondPoint.x, _y: line.secondPoint.y}
            })),

            pointsList: archive.pointsList.map(point => ({
                _x: point.x,
                _y: point.y
            })),
            wallsList: archive.wallsList.map(wall => ({
                _firstPoint: {_x: wall.firstPoint.x, _y: wall.firstPoint.y},
                _secondPoint: {_x: wall.secondPoint.x, _y: wall.secondPoint.y},
                _height: wall.height,
                _matrix: {_reverseTransformationMatrix: this.transformationService.reverseTransformationMatrix}
                // add other properties as needed
            })),
            doorsList: archive.doorsList.map(door => ({
                _wallIndex: archive.archiveWallsList.indexOf(door.wall), // Save index instead of wall data
                _point: {_x: door.center.x, _y: door.center.y},
                _doorType: door.doorType,
                _direction: door.direction,
                _height: door.height,
                _radius: door.radius
            })),
            windowsList: archive.windowsList.map(window => ({
                _wallIndex: archive.archiveWallsList.indexOf(window.wall), // Save index instead of wall data
                _point: {_x: window.center.x, _y: window.center.y},
                _radius: window.height
            }))
        };
        console.log("Setting data", JSON.stringify(state))
        console.log("points savie", state.pointsList)
        console.log("lines savie", state.linesList)
        console.log("lines archive", archive.linesList)
        console.log("walls savie", state.wallsList)
        localStorage.setItem('appState', JSON.stringify(state)); // Save state
    }

    getState(archive: ArchiveService): ArchiveService {
        const stateString = localStorage.getItem('appState');
        const stateStringParsed = stateString ? JSON.parse(stateString) : null;

        if (stateStringParsed) {
            // Individual assignment of attributes from the parsed state
            const pointsList = stateStringParsed.pointsList || [];
            archive.pointsList = pointsList.map((pointData: any) => new Point(pointData._x, pointData._y));
            archive.archivePointsList = archive.pointsList

            const linesList = stateStringParsed.linesList || [];
            archive.linesList = linesList.map(
                (lineData: any) => new Line(
                    new Point(lineData._firstPoint._x, lineData._firstPoint._y),
                    new Point(lineData._secondPoint._x, lineData._secondPoint._y))
            );
            archive.archiveLinesList = archive.linesList

            const wallsList = stateStringParsed.wallsList || [];
            archive.wallsList = wallsList.map((wallData: any) => new Wall(
                // Extract relevant data for constructing a Wall
                new Point(wallData._firstPoint._x, wallData._firstPoint._y),
                new Point(wallData._secondPoint._x, wallData._secondPoint._y),
                wallData._height,
                wallData._matrix._reverseTransformationMatrix
            ));
            archive.archiveWallsList = archive.wallsList
            console.log(("walls getty "), archive.archiveWallsList)
            // archive.doorsList = stateStringParsed.doorsList.map((doorData: any) => new Door(
            //     archive.wallsList[doorData._wallIndex], // Get wall reference from archive
            //     new Point(doorData._point._x, doorData._point._y),
            //     doorData._doorType,
            //     doorData._direction,
            //     doorData._height,
            //     doorData._radius
            // ));
            // archive.archiveDoorsList = archive.doorsList
            // console.log(("doors "), archive.doorsList)
            //
            // archive.windowsList = stateStringParsed.windowsList.map((windowData: any) => new Window(
            //     archive.archiveWallsList[windowData._wallIndex], // Get wall reference from archive
            //     new Point(windowData._point._x, windowData._point._y),
            //     windowData._radius
            // ));
        }
        return archive;
    }
}
