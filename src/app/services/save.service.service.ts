import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SaveService {

    constructor() {
    }

    saveState(state: any): void {
        localStorage.setItem('appState', JSON.stringify(state));
    }

    getState(): any {
        const stateString = localStorage.getItem('appState');
        return stateString ? JSON.parse(stateString) : null;
    }
}