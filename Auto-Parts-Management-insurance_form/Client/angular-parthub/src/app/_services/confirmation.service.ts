import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private componentRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  // Method to show the confirmation dialog with message, title and event handler
  confirm(message: string, title: string = 'Confirmation', buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo', onConfirmed: (confirmed: boolean) => void): void {

    if (this.componentRef != null){
      this.cleanup();
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationDialogComponent);
    this.componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(this.componentRef.hostView);

    // Set input data
    this.componentRef.instance.message = message;
    this.componentRef.instance.title = title;
    this.componentRef.instance.buttonType = buttonType;

    // Output events
    this.componentRef.instance.confirmed.subscribe((confirmed: boolean) => {
      onConfirmed(confirmed);  // Call the callback function passed from the parent
      this.cleanup();  // Clean up the dialog after the response is received
    });


    // Append to the body
    const domElem = (this.componentRef.hostView as any).rootNodes[0];
    document.body.appendChild(domElem);

  }

  // Cleanup after the dialog has been closed
  public cleanup(): void {
    //console.log("cleanup 1")
    if (this.componentRef) {
      //console.log("cleanup 2")
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
     // console.log("cleanup 3")
    }
  }
}
