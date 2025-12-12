import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Input() message: string = '';  // Message passed from the service/parent
  @Input() title: string = 'Confirmation';  // Title passed from the service/parent
  @Input() buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
  @Output() confirmed = new EventEmitter<boolean>();  // Emit true or false when user responds

 // buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo'; // Make sure it's strongly typed
  
  // Emit response when "Yes" or "OK" is clicked
  onConfirm(): void {
    this.confirmed.emit(true);  // Emit "true" when user clicks "Yes" or "OK"
  }

  onCancel(): void {
    this.confirmed.emit(false);  // Emit "false" when user clicks "No" or "Cancel"
  }

  // Just close the modal when "Cancel" is clicked (no action emitted)
  onDismiss(): void {
    // Simply close the modal without emitting any action
    this.confirmed.emit(undefined);  // This can be a custom value like `null`, or simply not emit at all
  }
}
