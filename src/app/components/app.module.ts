import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from "./app.component";
import {RouterOutlet} from "@angular/router";
import {MainBodyComponent} from "./main-body/main-body.component";
import {CanvasService} from "../services/canvas.service";
import {Mouse} from "../models/mouse";
import {ModesConfiguration} from "../models/modesConfiguration";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterOutlet,
        MainBodyComponent
    ],
    providers: [CanvasService, Mouse, ModesConfiguration],
    bootstrap: [AppComponent],
})
export class AppModule {
}
