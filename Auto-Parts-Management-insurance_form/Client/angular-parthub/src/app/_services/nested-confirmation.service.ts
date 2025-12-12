import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, OnDestroy } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationService } from './confirmation.service';

interface ModalLevel {
  id: string;
  zIndex: number;
  componentRef: ComponentRef<ConfirmationDialogComponent>;
  parentElement?: HTMLElement;
}

@Injectable({
  providedIn: 'root'
})
export class NestedConfirmationService implements OnDestroy {
  private modalStack: ModalLevel[] = [];
  private baseZIndex = 3000; // Very high z-index to ensure nested modals appear above all existing modals including editPart (1070)
  private zIndexIncrement = 10;
  private currentId = 0;
  private ariaHiddenObserver: MutationObserver | null = null;
  private focusEventListener: ((event: Event) => void) | null = null;

  constructor(
    private originalConfirmationService: ConfirmationService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    console.log('NestedConfirmationService initialized');
    this.initializeGlobalAriaHiddenMonitoring();
  }

  /**
   * Show a nested confirmation dialog that stacks on top of existing modals
   * @param message The confirmation message
   * @param title The dialog title
   * @param buttonType The button configuration
   * @param onConfirmed Callback function for user response
   * @returns Modal ID for tracking
   */
  confirm(
    message: string, 
    title: string = 'Confirmation', 
    buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo', 
    onConfirmed: (confirmed: boolean) => void
  ): string {
    const modalId = this.generateModalId();
    const zIndex = this.getNextZIndex();
    
    // Debug logging
    console.log(`NestedConfirmationService: Creating modal ${modalId} with z-index ${zIndex}`);
    console.log(`Current modal stack length: ${this.modalStack.length}`);
    
    // Create the component using the same approach as original service
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationDialogComponent);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    // Set input data
    componentRef.instance.message = message;
    componentRef.instance.title = title;
    componentRef.instance.buttonType = buttonType;

    // Handle the response and cleanup
    componentRef.instance.confirmed.subscribe((confirmed: boolean) => {
      onConfirmed(confirmed);
      this.closeModal(modalId);
    });

    // Get the DOM element and apply nested styling
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.applyNestedModalStyling(domElem, zIndex);
    
    // Add backdrop if this is a nested modal
    if (this.modalStack.length > 0) {
      this.addNestedBackdrop(domElem, zIndex - 1);
    }

    // Append to body
    document.body.appendChild(domElem);

    // Add to modal stack
    const modalLevel: ModalLevel = {
      id: modalId,
      zIndex: zIndex,
      componentRef: componentRef,
      parentElement: domElem
    };
    this.modalStack.push(modalLevel);

    // Fix aria-hidden conflicts with focused elements
    setTimeout(() => {
      this.fixAriaHiddenConflicts();
    }, 100);

    // Also fix aria-hidden conflicts when modal is actually shown
    setTimeout(() => {
      this.fixAriaHiddenConflicts();
    }, 150);

    return modalId;
  }

  /**
   * Close a specific modal by ID
   * @param modalId The modal ID to close
   */
  closeModal(modalId: string): void {
    const modalIndex = this.modalStack.findIndex(modal => modal.id === modalId);
    if (modalIndex === -1) return;

    const modal = this.modalStack[modalIndex];
    
    // Clean up the component
    if (modal.componentRef) {
      this.appRef.detachView(modal.componentRef.hostView);
      modal.componentRef.destroy();
    }

    // Remove the DOM element
    if (modal.parentElement && modal.parentElement.parentNode) {
      modal.parentElement.parentNode.removeChild(modal.parentElement);
    }

    // Remove nested backdrop if it exists
    this.removeNestedBackdrop(modal.zIndex - 1);

    // Remove from stack
    this.modalStack.splice(modalIndex, 1);
  }

  /**
   * Close all nested modals
   */
  closeAllModals(): void {
    while (this.modalStack.length > 0) {
      const modal = this.modalStack[this.modalStack.length - 1];
      this.closeModal(modal.id);
    }
  }

  /**
   * Get the number of currently open nested modals
   */
  getOpenModalCount(): number {
    return this.modalStack.length;
  }

  /**
   * Check if there are any open nested modals
   */
  hasOpenModals(): boolean {
    return this.modalStack.length > 0;
  }

  private generateModalId(): string {
    return `nested-modal-${++this.currentId}-${Date.now()}`;
  }

  private getNextZIndex(): number {
    // Find the highest z-index currently on the page
    const highestZIndex = this.getHighestZIndexOnPage();
    const calculatedZIndex = this.baseZIndex + (this.modalStack.length * this.zIndexIncrement);
    
    // Use whichever is higher: our calculated z-index or highest existing z-index + increment
    return Math.max(calculatedZIndex, highestZIndex + this.zIndexIncrement);
  }

  private getHighestZIndexOnPage(): number {
    let highestZIndex = 0;
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      const zIndex = window.getComputedStyle(htmlElement).zIndex;
      if (zIndex !== 'auto' && !isNaN(parseInt(zIndex))) {
        highestZIndex = Math.max(highestZIndex, parseInt(zIndex));
      }
    });
    
    return highestZIndex;
  }

  private applyNestedModalStyling(element: HTMLElement, zIndex: number): void {
    // Apply z-index to the modal with !important to override any CSS rules
    element.style.setProperty('z-index', zIndex.toString(), 'important');
    
    // Add classes for nested modal styling
    element.classList.add('nested-modal');
    if (this.modalStack.length > 0) {
      element.classList.add('nested-modal-level-' + (this.modalStack.length + 1));
    }

    // Ensure the modal is displayed
    element.classList.add('show');
    element.style.setProperty('display', 'block', 'important');
    
    // Fix aria-hidden conflicts after styling is applied
    setTimeout(() => {
      this.fixAriaHiddenConflicts();
    }, 200);
  }

  private addNestedBackdrop(modalElement: HTMLElement, zIndex: number): void {
    const backdropId = `nested-backdrop-${zIndex}`;
    
    // Don't create duplicate backdrops
    if (document.getElementById(backdropId)) return;

    const backdrop = document.createElement('div');
    backdrop.id = backdropId;
    backdrop.className = 'modal-backdrop fade show nested-backdrop';
    backdrop.style.setProperty('z-index', zIndex.toString(), 'important');
    backdrop.style.setProperty('background-color', 'rgba(0, 0, 0, 0.3)', 'important'); // Lighter backdrop for nested modals
    backdrop.style.setProperty('position', 'fixed', 'important');
    backdrop.style.setProperty('top', '0', 'important');
    backdrop.style.setProperty('left', '0', 'important');
    backdrop.style.setProperty('width', '100%', 'important');
    backdrop.style.setProperty('height', '100%', 'important');
    
    document.body.appendChild(backdrop);
  }

  private removeNestedBackdrop(zIndex: number): void {
    const backdropId = `nested-backdrop-${zIndex}`;
    const backdrop = document.getElementById(backdropId);
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }

  private initializeGlobalAriaHiddenMonitoring(): void {
    // Set up focus event listener to detect when elements inside aria-hidden modals get focus
    this.focusEventListener = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target) {
        // Check if the focused element is inside a modal with aria-hidden="true"
        const modal = target.closest('.modal[aria-hidden="true"]');
        if (modal) {
          modal.removeAttribute('aria-hidden');
          console.log('Removed aria-hidden from modal due to focus event:', modal.id || modal.className);
        }
      }
    };
    
    // Add global focus event listener
    document.addEventListener('focusin', this.focusEventListener, true);
    
    // Set up MutationObserver to watch for aria-hidden changes
    this.ariaHiddenObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('modal') && target.getAttribute('aria-hidden') === 'true') {
            // Check if this modal contains any focused elements
            setTimeout(() => this.checkModalForFocusedElements(target), 50);
          }
        }
      });
    });
    
    // Start observing
    this.ariaHiddenObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-hidden'],
      subtree: true
    });
    
    // Run initial check for existing modals with aria-hidden conflicts
    setTimeout(() => {
      this.fixAriaHiddenConflicts();
    }, 1000);
    
    // Set up periodic check every 2 seconds to catch any missed cases
    setInterval(() => {
      this.fixAriaHiddenConflicts();
    }, 2000);
    
    console.log('Global aria-hidden monitoring initialized');
  }
  
  private checkModalForFocusedElements(modal: HTMLElement): void {
    const focusedElement = modal.querySelector(':focus');
    if (focusedElement) {
      modal.removeAttribute('aria-hidden');
      console.log('Removed aria-hidden from modal with focused element:', modal.id || modal.className);
    }
  }

  private fixAriaHiddenConflicts(): void {
    // Find all modals with aria-hidden="true" that contain focused elements
    const modals = document.querySelectorAll('.modal[aria-hidden="true"]');
    modals.forEach(modal => {
      this.checkModalForFocusedElements(modal as HTMLElement);
    });
  }

  ngOnDestroy(): void {
    // Clean up event listeners and observers
    if (this.focusEventListener) {
      document.removeEventListener('focusin', this.focusEventListener, true);
      this.focusEventListener = null;
    }
    
    if (this.ariaHiddenObserver) {
      this.ariaHiddenObserver.disconnect();
      this.ariaHiddenObserver = null;
    }
    
    console.log('NestedConfirmationService destroyed and cleaned up');
  }

  /**
   * Fallback method that uses the original ConfirmationService
   * This ensures backward compatibility
   */
  confirmOriginal(
    message: string, 
    title: string = 'Confirmation', 
    buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo', 
    onConfirmed: (confirmed: boolean) => void
  ): void {
    this.originalConfirmationService.confirm(message, title, buttonType, onConfirmed);
  }
}