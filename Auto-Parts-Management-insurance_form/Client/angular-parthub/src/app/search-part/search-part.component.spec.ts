import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPartComponent } from './search-part.component';

describe('SearchPartComponent', () => {
  let component: SearchPartComponent;
  let fixture: ComponentFixture<SearchPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPartComponent]
    });
    fixture = TestBed.createComponent(SearchPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
