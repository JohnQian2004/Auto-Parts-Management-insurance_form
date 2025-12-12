// walker-modal.service.ts
import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef } from '@angular/core';
import { ItemViewerModalComponent } from '../item-viewer-modal/item-viewer-modal.component';
import { Claim } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ItemViewerModalService {

  private componentRef: ComponentRef<ItemViewerModalComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  open(claim: Claim, onClaimUpdated: (claim: Claim) => void) {
    // Create the component dynamically
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ItemViewerModalComponent);
    this.componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(this.componentRef.hostView);

    // Set input data
    this.componentRef.instance.claim = { ...claim };
    
    // Output events
    this.componentRef.instance.claimUpdated.subscribe((updatedClaim: Claim) => {
      onClaimUpdated(updatedClaim);
    });

    this.componentRef.instance.closeModal.subscribe(() => {
      this.close();
    });

    // Append to the body
    const domElem = (this.componentRef.hostView as any).rootNodes[0];
    document.body.appendChild(domElem);
  }

  close() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
