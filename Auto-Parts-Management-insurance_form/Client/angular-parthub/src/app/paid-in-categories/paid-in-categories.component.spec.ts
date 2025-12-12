import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidInCategoriesComponent } from './paid-in-categories.component';

describe('PaidInCategoriesComponent', () => {
  let component: PaidInCategoriesComponent;
  let fixture: ComponentFixture<PaidInCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaidInCategoriesComponent]
    });
    fixture = TestBed.createComponent(PaidInCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
