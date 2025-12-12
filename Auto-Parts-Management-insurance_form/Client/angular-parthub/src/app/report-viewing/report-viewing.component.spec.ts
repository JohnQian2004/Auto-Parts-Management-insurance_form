import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewingComponent } from './report-viewing.component';

describe('ReportViewingComponent', () => {
    let component: ReportViewingComponent;
    let fixture: ComponentFixture<ReportViewingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReportViewingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ReportViewingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
}); 