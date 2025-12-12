import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopManagementShopComponent } from './shop-management-shop.component';
 
describe('ShopManagementShopComponent', () => {
  let component: ShopManagementShopComponent;
  let fixture: ComponentFixture<ShopManagementShopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopManagementShopComponent]
    });
    fixture = TestBed.createComponent(ShopManagementShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
