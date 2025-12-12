import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfParserComponent } from './pdf-parser.component';

describe('PdfParserComponent', () => {
  let component: PdfParserComponent;
  let fixture: ComponentFixture<PdfParserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfParserComponent]
    });
    fixture = TestBed.createComponent(PdfParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
