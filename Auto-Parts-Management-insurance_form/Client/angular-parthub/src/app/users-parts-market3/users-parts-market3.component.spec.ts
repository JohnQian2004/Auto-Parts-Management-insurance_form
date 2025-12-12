import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPartsMarket3Component } from './users-parts-market3.component';

describe('UsersPartsMarket3Component', () => {
  let component: UsersPartsMarket3Component;
  let fixture: ComponentFixture<UsersPartsMarket3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPartsMarket3Component]
    });
    fixture = TestBed.createComponent(UsersPartsMarket3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
