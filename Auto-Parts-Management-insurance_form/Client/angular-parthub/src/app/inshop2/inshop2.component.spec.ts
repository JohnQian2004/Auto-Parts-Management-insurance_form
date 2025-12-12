import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InshopComponent } from './inshop.component';

describe('InshopComponent', () => {
  let component: InshopComponent;
  let fixture: ComponentFixture<InshopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InshopComponent]
    });
    fixture = TestBed.createComponent(InshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
