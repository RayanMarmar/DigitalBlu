import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Point} from "../models/point";
import {Wall} from "../models/wall";
import {Door} from "../models/door";
import {Line} from "../models/line";
import {Window} from "../models/window";

@Injectable({
    providedIn: 'root'
})
export class ComponentSelectorService {

    constructor(
        private archiveService: ArchiveService,
    ) {

    }

    getNearestComponent(point: Point): Wall | Line | Door | Window | void {
        //Check highest prio first: wall openings and windows.
        let i: number = this.archiveService.inRangeOfAnExistingDoor(point)
        let x: number = this.archiveService.inRangeOfAnExistingWindow(point)
        if ((i == -1) && (x != -1)) {
            console.log("Window")
            return this.archiveService.windowsList[x]

        } else if ((i != -1) && (x == -1)) {
            console.log("Door")
            return this.archiveService.doorsList[i]
        } else {
            let i: number = this.archiveService.inRangeOfAnExistingWall(point)
            if (i != -1) {
                console.log("Wall")
                return this.archiveService.wallsList[i]
            } else {
                let i: number = this.archiveService.inRangeOfAnExistingLine(point)
                if (i != -1) {
                    console.log("Line")
                    return this.archiveService.linesList[i]
                }
            }
        }
    }
}
