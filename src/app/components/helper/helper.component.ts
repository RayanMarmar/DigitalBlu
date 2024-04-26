import {AfterViewInit, Component} from '@angular/core';
import {ModesConfiguration} from "../../models/modesConfiguration";


@Component({
    selector: 'app-helper',
    standalone: true,
    imports: [],
    templateUrl: './helper.component.html',
    styleUrl: './helper.component.css'
})

export class HelperComponent implements AfterViewInit {
    // its important myCanvas matches the variable name in the template

    constructor(
        private modesConfiguration: ModesConfiguration,
    ) {

    }

    ngAfterViewInit(): void {
        throw new Error('Method not implemented.');
    }

    displayHelper() {
        this.modesConfiguration.helperOn();
    }

}

