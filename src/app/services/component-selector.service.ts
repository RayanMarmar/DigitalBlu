import {Injectable} from '@angular/core';
import {ArchiveService} from "./archive.service";
import {Point} from "../drawables/point"
import {Wall} from "../drawables/wall";
import {Door} from "../drawables/door";
import {Line} from "../drawables/line";
import {Window} from "../drawables/window";

@Injectable({
    providedIn: 'root'
})
export class ComponentSelectorService {

    constructor(
        private archiveService: ArchiveService,
    ) {

    }

    getNearestComponent(point: Point): Wall | Line | Door | Window | void {

        let {min, minLine} = this.archiveService.inRangeOfAnExistingLine(point)
        console.log("nearest wall at", min, minLine);
        return minLine;
    }
}
