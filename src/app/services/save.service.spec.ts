import {TestBed} from '@angular/core/testing';
import {SaveService} from "./save.service.service";

describe('SaveServiceService', () => {
    let service: SaveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SaveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
