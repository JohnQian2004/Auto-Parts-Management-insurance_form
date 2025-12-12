import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPartsMarketComponent } from './users-parts-market.component';

describe('UsersPartsMarketComponent', () => {
  let component: UsersPartsMarketComponent;
  let fixture: ComponentFixture<UsersPartsMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPartsMarketComponent]
    });
    fixture = TestBed.createComponent(UsersPartsMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
