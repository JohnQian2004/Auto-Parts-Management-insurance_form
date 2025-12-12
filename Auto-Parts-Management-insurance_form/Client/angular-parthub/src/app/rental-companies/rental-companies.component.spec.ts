import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalCompaniesComponent } from './rental-companies.component';

describe('RentalCompaniesComponent', () => {
  let component: RentalCompaniesComponent;
  let fixture: ComponentFixture<RentalCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentalCompaniesComponent]
    });
    fixture = TestBed.createComponent(RentalCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
