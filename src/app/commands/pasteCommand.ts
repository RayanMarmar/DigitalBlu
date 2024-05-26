import {CopyPasteService} from "../services/copy-paste.service";

export class PasteCommand implements Command{
    constructor(
        private copyPasteService : CopyPasteService,
    ) {
    }
    execute():void {
        this.copyPasteService.pasteElement()
    }
    undo():void {
        this.copyPasteService.deleteElement()
    }
}