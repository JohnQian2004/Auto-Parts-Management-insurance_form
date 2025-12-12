import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtuoPartsComponent } from './atuo-parts.component';

describe('AtuoPartsComponent', () => {
  let component: AtuoPartsComponent;
  let fixture: ComponentFixture<AtuoPartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtuoPartsComponent]
    });
    fixture = TestBed.createComponent(AtuoPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
