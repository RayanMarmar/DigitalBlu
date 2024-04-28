import {TestBed} from '@angular/core/testing';

import {ModeManagerService} from './mode-manager.service';

describe('ModeManagerService', () => {
    let service: ModeManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModeManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
