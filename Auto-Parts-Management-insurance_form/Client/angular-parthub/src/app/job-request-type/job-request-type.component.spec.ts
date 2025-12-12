import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequestTypeComponent } from './job-request-type.component';

describe('JobStatusComponent', () => {
  let component: JobRequestTypeComponent;
  let fixture: ComponentFixture<JobRequestTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobRequestTypeComponent]
    });
    fixture = TestBed.createComponent(JobRequestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
