import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRoutineComponent } from './employee-routine.component';

describe('EmployeeRoutineComponent', () => {
  let component: EmployeeRoutineComponent;
  let fixture: ComponentFixture<EmployeeRoutineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRoutineComponent]
    });
    fixture = TestBed.createComponent(EmployeeRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
