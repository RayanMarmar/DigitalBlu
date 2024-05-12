import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Line} from "../drawables/line";
import {Point} from "../drawables/point";
import {TransformationService} from "./transformation.service";
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";
import {Window} from "../drawables/window";

@Injectable({
    providedIn: 'root'
})
export class SaveService {
    constructor(
        private transformationService: TransformationService,
        private archiveService: ArchiveService,
    ) {
    }


    saveState(): void {
        console.log(this.archiveService.doorsList);
        const state = {
            linesList: this.archiveService.linesList.map(line => ({
                _firstPoint: {_x: line.firstPoint.x, _y: line.firstPoint.y},
                _secondPoint: {_x: line.secondPoint.x, _y: line.secondPoint.y}
            })),

            pointsList: this.archiveService.pointsList.map(point => ({
                _x: point.x,
                _y: point.y
            })),
            wallsList: this.archiveService.wallsList.map((wall) => ({
                _firstPoint: wall.fourthLine.calculateCenter(),
                _secondPoint: wall.secondLine.calculateCenter(),
                _height: wall.height,
                _matrix: {_reverseTransformationMatrix: this.transformationService.reverseTransformationMatrix},
                _uid: wall.uid
            })),

            doorsList: this.archiveService.doorsList.map((door) => ({
                _uid: door.wall.uid,
                _point: {_x: door.base[0].calculateCenter().x, _y: door.base[0].calculateCenter().y},
                _doorType: door.doorType,
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
        localStorage.setItem('appState', JSON.stringify(state)); // Save state
    }

    getState(archive: ArchiveService): ArchiveService {

        const stateString = localStorage.getItem('appState');
        const stateStringParsed = stateString ? JSON.parse(stateString) : null;

        if (stateStringParsed) {
            // Individual assignment of attributes from the parsed state

            // SETTING POINTS
            const pointsList = stateStringParsed.pointsList || [];
            archive.pointsList = pointsList.map((pointData: any) => new Point(pointData._x, pointData._y));

            // SETTING LINES
            const linesList = stateStringParsed.linesList || [];
            archive.linesList = linesList.map(
                (lineData: any) => new Line(
                    new Point(lineData._firstPoint._x, lineData._firstPoint._y),
                    new Point(lineData._secondPoint._x, lineData._secondPoint._y))
            );

            // SETTING WALLS
            const wallsList = stateStringParsed.wallsList || [];
            archive.wallsList = wallsList.map((wallData: any) => new Wall(
                // Extract relevant data for constructing a Wall
                new Point(wallData._firstPoint._x, wallData._firstPoint._y),
                new Point(wallData._secondPoint._x, wallData._secondPoint._y),
                wallData._height,
                wallData._matrix._reverseTransformationMatrix,
                wallData._uid
            ));

            // SETTING DOORS
            const doorsList = stateStringParsed.doorsList || [];
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
            archive.windowsList = stateStringParsed.windowsList.map((windowData: any) => {

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

    clearState(): void {
        localStorage.removeItem('appState');
    }
}
