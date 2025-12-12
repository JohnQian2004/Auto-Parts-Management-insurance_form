import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalModeComponent } from './arrival-mode.component';

describe('ArrivalModeComponent', () => {
  let component: ArrivalModeComponent;
  let fixture: ComponentFixture<ArrivalModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrivalModeComponent]
    });
    fixture = TestBed.createComponent(ArrivalModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
