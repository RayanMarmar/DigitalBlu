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
                _wall: {
                    _firstPoint: {_x: door.wall.firstPoint.x, _y: door.wall.firstPoint.y},
                    _secondPoint: {_x: door.wall.secondPoint.x, _y: door.wall.secondPoint.y},
                    _height: door.wall.height,
                    _matrix: {_reverseTransformationMatrix: this.transformationService.reverseTransformationMatrix}
                },
                _point: {
                    _x: door. .point.x,
                    _y: door.point.y
                }
            }))
        };
        console.log("Setting data", JSON.stringify(state))
        localStorage.setItem('appState', JSON.stringify(state)); // Save state
    }

    getState(): ArchiveService {
        const stateString = localStorage.getItem('appState');
        const stateStringParsed = stateString ? JSON.parse(stateString) : null;
        const archive = new ArchiveService(); // Assuming ArchiveService has a default constructor

        if (stateStringParsed) {
            // Individual assignment of attributes from the parsed state
            const pointsList = stateStringParsed.pointsList || [];
            archive.pointsList = pointsList.map((pointData: any) => new Point(pointData._x, pointData._y));
            console.log("POints", pointsList)
            console.log("archived", archive.pointsList)
            const linesList = stateStringParsed.linesList || [];

            archive.archiveLinesList = linesList.map(
                (lineData: any) => new Line(
                    new Point(lineData._firstPoint._x, lineData._firstPoint._y),
                    new Point(lineData._secondPoint._x, lineData._secondPoint._y)));


            console.log("linesList", linesList)
            const wallsList = stateStringParsed.wallsList || [];
            archive.archiveWallsList = wallsList.map((wallData: any) => new Wall(
                // Extract relevant data for constructing a Wall
                new Point(wallData._firstPoint._x, wallData._firstPoint._y),
                new Point(wallData._secondPoint._x, wallData._secondPoint._y),
                wallData._height,
                wallData._matrix._reverseTransformationMatrix
            ));
            console.log("wallsss", wallsList)
            console.log("Archivvee wallsss", archive.archiveWallsList)
        }
        return archive;
    }
}
