import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPanelComponent } from './market-panel.component';

describe('MarketPanelComponent', () => {
  let component: MarketPanelComponent;
  let fixture: ComponentFixture<MarketPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketPanelComponent]
    });
    fixture = TestBed.createComponent(MarketPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
