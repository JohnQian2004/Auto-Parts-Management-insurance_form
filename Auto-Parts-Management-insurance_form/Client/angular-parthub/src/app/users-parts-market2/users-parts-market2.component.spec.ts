import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPartsMarket2Component } from './users-parts-market2.component';

describe('UsersPartsMarket2Component', () => {
  let component: UsersPartsMarket2Component;
  let fixture: ComponentFixture<UsersPartsMarket2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPartsMarket2Component]
    });
    fixture = TestBed.createComponent(UsersPartsMarket2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
