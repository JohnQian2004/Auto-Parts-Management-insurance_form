import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLocationComponent } from './parking-location.component';

describe('ParkingLocationComponent', () => {
  let component: ParkingLocationComponent;
  let fixture: ComponentFixture<ParkingLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParkingLocationComponent]
    });
    fixture = TestBed.createComponent(ParkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
