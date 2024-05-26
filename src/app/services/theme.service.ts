import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    getCanvasColor(): string {
        return getComputedStyle(this.document.documentElement).getPropertyValue('--main-bg-color');
    }

    getDrawableColor(): string {
        return getComputedStyle(this.document.documentElement).getPropertyValue('--wall-color');
    }

    getDeleteDrawableColor(): string {
        return getComputedStyle(this.document.documentElement).getPropertyValue('--delete-drawable-color');
    }

    getSelectedDrawableColor(eraseMode: boolean = false): string {
        const colorProperty = eraseMode ? '--delete-drawable-color' : '--selected-drawable-color';
        return getComputedStyle(this.document.documentElement).getPropertyValue(colorProperty);
    }

    toggleDarkMode(darkMode: boolean) {
        if (darkMode) {
            this.document.documentElement.classList.add('dark-mode');
        } else {
            this.document.documentElement.classList.remove('dark-mode');
        }
    }
}
