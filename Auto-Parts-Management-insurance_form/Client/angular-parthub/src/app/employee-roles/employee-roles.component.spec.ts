import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRolesComponent } from './employee-roles.component';

describe('EmployeeRolesComponent', () => {
  let component: EmployeeRolesComponent;
  let fixture: ComponentFixture<EmployeeRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRolesComponent]
    });
    fixture = TestBed.createComponent(EmployeeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
