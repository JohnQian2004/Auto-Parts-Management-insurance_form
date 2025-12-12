import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPart2Component } from './list-part2.component';

describe('ListPart2Component', () => {
  let component: ListPart2Component;
  let fixture: ComponentFixture<ListPart2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPart2Component]
    });
    fixture = TestBed.createComponent(ListPart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
