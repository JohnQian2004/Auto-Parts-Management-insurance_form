import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVehicle2Component } from './detail-vehicle2.component';

describe('DetailVehicle2Component', () => {
  let component: DetailVehicle2Component;
  let fixture: ComponentFixture<DetailVehicle2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailVehicle2Component]
    });
    fixture = TestBed.createComponent(DetailVehicle2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
