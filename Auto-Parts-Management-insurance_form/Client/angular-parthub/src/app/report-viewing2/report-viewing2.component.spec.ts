import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewing2Component } from './report-viewing2.component';

describe('ReportViewing2Component', () => {
  let component: ReportViewing2Component;
  let fixture: ComponentFixture<ReportViewing2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportViewing2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportViewing2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});