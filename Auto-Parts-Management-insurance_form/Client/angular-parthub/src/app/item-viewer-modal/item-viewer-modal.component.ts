// walker-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Claim} from '../models/claim.model'

@Component({
  selector: 'app-item-viewer-modal',
  templateUrl: './item-viewer-modal.component.html',
  styleUrls: ['./item-viewer-modal.component.css']
})

export class ItemViewerModalComponent {
  @Input() claim: Claim | null = null;
  @Output() claimUpdated = new EventEmitter<Claim>();
  @Output() closeModal = new EventEmitter<void>();

  // Updates Walker data when changes happen
  updateClaim() {
    if (this.claim) {
      this.claimUpdated.emit(this.claim);
    }
  }

  // Closes the modal
  close() {
    this.closeModal.emit();
  }
}
