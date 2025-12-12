import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeHomeComponent } from './intake-home2.component';

describe('IntakeHomeComponent', () => {
  let component: IntakeHomeComponent;
  let fixture: ComponentFixture<IntakeHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntakeHomeComponent]
    });
    fixture = TestBed.createComponent(IntakeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
