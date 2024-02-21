import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    getBackgroundColor(): string {
        return getComputedStyle(this.document.documentElement).getPropertyValue('--main-bg-color');
    }

    getWallColor(): string {
        return getComputedStyle(this.document.documentElement).getPropertyValue('--wall-color');
    }

    toggleDarkMode(darkMode: boolean) {
        if (darkMode) {
            this.document.documentElement.classList.add('dark-mode');
        } else {
            this.document.documentElement.classList.remove('dark-mode');
        }
    }
}
