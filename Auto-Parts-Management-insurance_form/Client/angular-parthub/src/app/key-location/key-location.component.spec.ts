import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyLocationComponent } from './key-location.component';

describe('KeyLocationComponent', () => {
  let component: KeyLocationComponent;
  let fixture: ComponentFixture<KeyLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyLocationComponent]
    });
    fixture = TestBed.createComponent(KeyLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
