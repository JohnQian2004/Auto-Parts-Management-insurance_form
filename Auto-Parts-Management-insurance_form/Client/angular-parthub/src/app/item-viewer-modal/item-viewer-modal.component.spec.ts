import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewerModalComponent } from './item-viewer-modal.component';

describe('ItemViewerComponent', () => {
  let component: ItemViewerModalComponent;
  let fixture: ComponentFixture<ItemViewerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemViewerModalComponent]
    });
    fixture = TestBed.createComponent(ItemViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
