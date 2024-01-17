import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBodyComponent } from './main-body.component';

describe('MainBodyComponent', () => {
  let component: MainBodyComponent;
  let fixture: ComponentFixture<MainBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
