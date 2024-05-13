import {Component} from '@angular/core';
import {ModesConfiguration} from "../../models/modesConfiguration";


@Component({
    selector: 'app-helper',
    standalone: true,
    imports: [],
    templateUrl: './helper.component.html',
    styleUrl: './helper.component.css'
})

export class HelperComponent {
    constructor(
        public modesConfiguration: ModesConfiguration,
    ) {

    }

    closeHelper() {
        this.modesConfiguration.helperDisplayed = false;
    }

}

