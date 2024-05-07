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
                _firstPoint: {_x: wall.firstPoint.x, _y: wall.firstPoint.y},
                _secondPoint: {_x: wall.secondPoint.x, _y: wall.secondPoint.y},
                _height: wall.height,
                _matrix: {_reverseTransformationMatrix: this.transformationService.reverseTransformationMatrix},
                _index: wall.index
            })),

            doorsList: this.archiveService.doorsList.map((door) => ({
                _uid: door.wall.index,
                _point: {_x: door.center.x, _y: door.center.y},
                _doorType: door.doorType,
                _direction: door.direction,
                _height: door.height,
                _radius: door.radius
            })),
            windowsList: this.archiveService.windowsList.map(window => ({
                _uid: window.wall.index,
                _point: {_x: window.center.x, _y: window.center.y},
                _radius: window.height
            }))
        };
        localStorage.setItem('appState', JSON.stringify(state)); // Save state

    }

    getState(archive: ArchiveService): ArchiveService {

        const stateString = localStorage.getItem('appState');
        const stateStringParsed = stateString ? JSON.parse(stateString) : null;

        if (stateStringParsed) {
            // Individual assignment of attributes from the parsed state

            ///SETTING POINTS//////

            const pointsList = stateStringParsed.pointsList || [];
            archive.pointsList = pointsList.map((pointData: any) => new Point(pointData._x, pointData._y));
            archive.archivePointsList = archive.pointsList

            ///\SETTING POINTS//////

            ///SETTING LINES//////
            const linesList = stateStringParsed.linesList || [];
            archive.linesList = linesList.map(
                (lineData: any) => new Line(
                    new Point(lineData._firstPoint._x, lineData._firstPoint._y),
                    new Point(lineData._secondPoint._x, lineData._secondPoint._y))
            );
            archive.archiveLinesList = archive.linesList
            ///\SETTING LINES//////

            ///SETTING WALLS//////
            const wallsList = stateStringParsed.wallsList || [];
            archive.wallsList = wallsList.map((wallData: any) => new Wall(
                // Extract relevant data for constructing a Wall
                new Point(wallData._firstPoint._x, wallData._firstPoint._y),
                new Point(wallData._secondPoint._x, wallData._secondPoint._y),
                wallData._height,
                wallData._matrix._reverseTransformationMatrix,
                wallData._index
            ));
            archive.archiveWallsList = archive.wallsList
            ///\SETTING WALLS//////

            ///SETTING DOORS//////
            const doorsList = stateStringParsed.doorsList || [];
            archive.doorsList = doorsList.map((doorData: any) => {
                // Find the existing wall associated with the door

                let wall = archive.getWallByIndex(doorData._index)
                if (wall) {
                    return new Door(
                        wall, // Pass the existing wall
                        new Point(doorData._point._x, doorData._point._y),
                        doorData._doorType,
                        doorData._direction,
                        doorData._height,
                        doorData._radius
                    );
                } else {
                    // Handle case where wall is not found
                    console.error(`Wall with index ${doorData._index} not found.`);
                    return null; // or handle differently based on your use case
                }
            });
            archive.archiveDoorsList = archive.doorsList
            ///////\SETTING DOORS//////

            ///SETTING WINDOWS//////
            archive.windowsList = stateStringParsed.windowsList.map((windowData: any) => {

                let wall = archive.getWallByIndex(windowData._index)
                if (wall) {
                    return new Window(
                        wall, // Get wall reference from archive
                        new Point(windowData._point._x, windowData._point._y),
                        windowData._radius
                    )
                } else {
                    // Handle case where wall is not found
                    console.error(`Wall with index ${windowData._index} not found.`);
                    return null; // or handle differently based on your use case
                }

            });
            archive.archiveWindowsList = archive.windowsList

            ///\SETTING WINDOWS//////


        }
        return archive;
    }

    clearState(): void {
        localStorage.removeItem('appState');
    }
}
