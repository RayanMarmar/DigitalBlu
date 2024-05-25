import {CopyPasteService} from "../services/copy-paste.service";

export class PasteCommand implements Command{
    constructor(
        private copyPasteService : CopyPasteService,
    ) {
    }
    execute():void {
        console.log("executingPaste")
        this.copyPasteService.pasteElement()
    }
    undo():void {
        // this.archiveService.deleteElement() = null ;
    }
}