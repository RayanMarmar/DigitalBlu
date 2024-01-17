import {TestBed} from '@angular/core/testing';

import {ArchiveServiceService} from './archive.service';

describe('ArchiveServiceService', () => {
    let service: ArchiveServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArchiveServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
