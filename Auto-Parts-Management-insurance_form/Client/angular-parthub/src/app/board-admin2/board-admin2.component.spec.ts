import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAdminComponent2 } from './board-admin2.component';

describe('BoardAdminComponent2', () => {
  let component: BoardAdminComponent2;
  let fixture: ComponentFixture<BoardAdminComponent2>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardAdminComponent2]
    });
    fixture = TestBed.createComponent(BoardAdminComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
