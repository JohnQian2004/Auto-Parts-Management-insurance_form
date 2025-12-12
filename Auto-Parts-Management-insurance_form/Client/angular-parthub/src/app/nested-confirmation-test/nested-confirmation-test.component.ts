import { Component } from '@angular/core';
import { NestedConfirmationService } from '../_services/nested-confirmation.service';
import { ConfirmationService } from '../_services/confirmation.service';

@Component({
  selector: 'app-nested-confirmation-test',
  template: `
    <div class="container mt-4">
      <h3>Nested Confirmation Service Test</h3>
      <div class="row">
        <div class="col-md-6">
          <h5>Original ConfirmationService</h5>
          <button class="btn btn-primary me-2" (click)="showOriginalConfirmation()">Show Original Dialog</button>
        </div>
        <div class="col-md-6">
          <h5>NestedConfirmationService</h5>
          <button class="btn btn-success me-2" (click)="showNestedConfirmation()">Show Nested Dialog</button>
          <button class="btn btn-warning me-2" (click)="showMultipleNested()">Show Multiple Nested</button>
          <button class="btn btn-danger" (click)="closeAllNested()">Close All Nested</button>
        </div>
      </div>
      
      <div class="mt-4">
        <h5>Status</h5>
        <p>Open Nested Modals: {{ openModalCount }}</p>
        <p>Last Response: {{ lastResponse }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
    }
    .btn {
      margin-bottom: 10px;
    }
  `]
})
export class NestedConfirmationTestComponent {
  openModalCount = 0;
  lastResponse = 'None';

  constructor(
    private nestedConfirmationService: NestedConfirmationService,
    private originalConfirmationService: ConfirmationService
  ) {
    // Update modal count periodically
    setInterval(() => {
      this.openModalCount = this.nestedConfirmationService.getOpenModalCount();
    }, 500);
  }

  showOriginalConfirmation(): void {
    this.originalConfirmationService.confirm(
      'This is the original ConfirmationService dialog. It will replace any existing dialog.',
      'Original Confirmation',
      'yesNo',
      (confirmed: boolean) => {
        this.lastResponse = `Original: ${confirmed ? 'Yes' : 'No'}`;
      }
    );
  }

  showNestedConfirmation(): void {
    const modalId = this.nestedConfirmationService.confirm(
      'This is a nested confirmation dialog. It stacks on top of existing modals.',
      'Nested Confirmation',
      'yesNo',
      (confirmed: boolean) => {
        this.lastResponse = `Nested: ${confirmed ? 'Yes' : 'No'}`;
      }
    );
    console.log('Created nested modal with ID:', modalId);
  }

  showMultipleNested(): void {
    // Show first nested dialog
    this.nestedConfirmationService.confirm(
      'This is the first nested dialog.',
      'First Nested Dialog',
      'yesNo',
      (confirmed: boolean) => {
        this.lastResponse = `First Nested: ${confirmed ? 'Yes' : 'No'}`;
        
        // Show second nested dialog after first one responds
        if (confirmed) {
          this.nestedConfirmationService.confirm(
            'You clicked Yes! This is the second nested dialog.',
            'Second Nested Dialog',
            'okCancel',
            (confirmed2: boolean) => {
              this.lastResponse = `Second Nested: ${confirmed2 ? 'OK' : 'Cancel'}`;
              
              // Show third nested dialog
              if (confirmed2) {
                this.nestedConfirmationService.confirm(
                  'Final confirmation! Are you sure about everything?',
                  'Final Confirmation',
                  'yesNoCancel',
                  (confirmed3: boolean) => {
                    this.lastResponse = `Final: ${confirmed3 === true ? 'Yes' : confirmed3 === false ? 'No' : 'Cancel'}`;
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  closeAllNested(): void {
    this.nestedConfirmationService.closeAllModals();
    this.lastResponse = 'All nested modals closed';
  }
}