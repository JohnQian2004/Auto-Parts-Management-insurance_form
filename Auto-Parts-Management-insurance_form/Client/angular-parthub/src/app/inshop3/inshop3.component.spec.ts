import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inshop3Component } from './inshop3.component';

describe('InshopComponent', () => {
  let component: Inshop3Component;
  let fixture: ComponentFixture<Inshop3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Inshop3Component]
    });
    fixture = TestBed.createComponent(Inshop3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
