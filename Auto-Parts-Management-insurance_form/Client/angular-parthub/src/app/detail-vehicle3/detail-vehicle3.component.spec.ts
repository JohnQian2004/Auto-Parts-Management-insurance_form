import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVehicle3Component } from './detail-vehicle3.component';

describe('DetailVehicle3Component', () => {
  let component: DetailVehicle3Component;
  let fixture: ComponentFixture<DetailVehicle3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailVehicle3Component]
    });
    fixture = TestBed.createComponent(DetailVehicle3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
