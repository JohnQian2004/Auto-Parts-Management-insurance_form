import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMenualComponent } from './repair-menual.component';

describe('RepairMenualComponent', () => {
  let component: RepairMenualComponent;
  let fixture: ComponentFixture<RepairMenualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepairMenualComponent]
    });
    fixture = TestBed.createComponent(RepairMenualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
