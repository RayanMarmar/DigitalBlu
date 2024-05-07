import { TestBed } from '@angular/core/testing';

import { ComponentSelectorService } from './component-selector.service';

describe('ComponentSelectorService', () => {
  let service: ComponentSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
