import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inshop4Component } from './inshop4.component';

describe('Inshop4Component', () => {
  let component: Inshop4Component;
  let fixture: ComponentFixture<Inshop4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Inshop4Component]
    });
    fixture = TestBed.createComponent(Inshop4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
