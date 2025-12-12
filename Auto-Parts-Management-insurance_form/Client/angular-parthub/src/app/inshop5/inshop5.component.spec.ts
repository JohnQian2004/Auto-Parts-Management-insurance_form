import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inshop5Component } from './inshop5.component';

describe('Inshop5Component', () => {
  let component: Inshop5Component;
  let fixture: ComponentFixture<Inshop5Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Inshop5Component]
    });
    fixture = TestBed.createComponent(Inshop5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
