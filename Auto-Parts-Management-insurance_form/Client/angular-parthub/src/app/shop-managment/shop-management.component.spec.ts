import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopManagementComponent } from './shop-management.component';

 
describe('ShopManagementComponent', () => {
  let component: ShopManagementComponent;
  let fixture: ComponentFixture<ShopManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopManagementComponent]
    });
    fixture = TestBed.createComponent(ShopManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
