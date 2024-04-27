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
    // its important myCanvas matches the variable name in the template

    constructor(
        public modesConfiguration: ModesConfiguration,
    ) {

    }

}

