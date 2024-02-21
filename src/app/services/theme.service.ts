import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    toggleDarkMode(darkMode: boolean) {
        if (darkMode) {
            this.document.documentElement.classList.add('dark-mode');
        } else {
            this.document.documentElement.classList.remove('dark-mode');
        }
    }
}
