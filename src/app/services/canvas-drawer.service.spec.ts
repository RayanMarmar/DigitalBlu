import { TestBed } from '@angular/core/testing';

import { CanvasDrawerService } from './canvas-drawer.service';

describe('CanvasDrawerService', () => {
  let service: CanvasDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
