import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDefinedJobsComponent } from './pre-defined-jobs.component';

describe('PreDefinedJobsComponent', () => {
  let component: PreDefinedJobsComponent;
  let fixture: ComponentFixture<PreDefinedJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreDefinedJobsComponent]
    });
    fixture = TestBed.createComponent(PreDefinedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
