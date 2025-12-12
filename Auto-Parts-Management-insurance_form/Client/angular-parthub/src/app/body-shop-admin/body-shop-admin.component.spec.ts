import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyShopAdminComponent } from './body-shop-admin.component';

describe('BodyShopAdminComponent', () => {
  let component: BodyShopAdminComponent;
  let fixture: ComponentFixture<BodyShopAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BodyShopAdminComponent]
    });
    fixture = TestBed.createComponent(BodyShopAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
