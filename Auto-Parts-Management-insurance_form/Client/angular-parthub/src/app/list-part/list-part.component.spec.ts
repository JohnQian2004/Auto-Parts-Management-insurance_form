import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartComponent } from './list-part.component';

describe('ListPartComponent', () => {
  let component: ListPartComponent;
  let fixture: ComponentFixture<ListPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPartComponent]
    });
    fixture = TestBed.createComponent(ListPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
