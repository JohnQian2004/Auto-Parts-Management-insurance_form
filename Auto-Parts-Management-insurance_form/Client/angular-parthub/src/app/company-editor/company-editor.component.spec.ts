import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEditorComponent } from './company-editor.component';

describe('CompanyEditorComponent', () => {
  let component: CompanyEditorComponent;
  let fixture: ComponentFixture<CompanyEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyEditorComponent]
    });
    fixture = TestBed.createComponent(CompanyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
