import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeView2Component } from './employee-view2.component';

describe('EmployeeView2Component', () => {
  let component: EmployeeView2Component;
  let fixture: ComponentFixture<EmployeeView2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeView2Component]
    });
    fixture = TestBed.createComponent(EmployeeView2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
