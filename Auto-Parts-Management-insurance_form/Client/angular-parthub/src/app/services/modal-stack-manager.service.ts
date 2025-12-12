import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalStackManager {
  private modalStack: string[] = [];
  private readonly baseZIndex = 1050;
  private readonly zIndexIncrement = 10;

  /**
   * Push a modal onto the stack and update z-indexes
   */
  pushModal(modalId: string): void {
    if (!this.modalStack.includes(modalId)) {
      this.modalStack.push(modalId);
      this.updateZIndexes();
      this.adjustBackdrops();
      console.log(`Modal ${modalId} pushed to stack. Current stack:`, this.modalStack);
    }
  }

  /**
   * Pop a modal from the stack and update z-indexes
   */
  popModal(modalId: string): void {
    const index = this.modalStack.indexOf(modalId);
    if (index > -1) {
      this.modalStack.splice(index, 1);
      this.updateZIndexes();
      this.adjustBackdrops();
      console.log(`Modal ${modalId} popped from stack. Current stack:`, this.modalStack);

      // If this was the top modal and there's a parent modal, ensure it's visible
      if (this.modalStack.length > 0) {
        const parentModalId = this.getCurrentModal();
        if (parentModalId) {
          // Use immediate execution instead of setTimeout for better performance
          this.ensureModalVisibleImmediate(parentModalId);
        }
      }
    }
  }

  /**
   * Update z-indexes for all modals in the stack
   */
  private updateZIndexes(): void {
    this.modalStack.forEach((modalId, index) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        const zIndex = this.baseZIndex + (index * this.zIndexIncrement);
        modal.style.zIndex = zIndex.toString();

        // Also update the backdrop if it exists
        const backdrop = document.querySelector(`.modal-backdrop[data-bs-target="#${modalId}"]`) as HTMLElement;
        if (backdrop) {
          backdrop.style.zIndex = (zIndex - 1).toString();
        }
      }
    });
  }

  /**
   * Get the currently active modal (top of stack)
   */
  getCurrentModal(): string | null {
    return this.modalStack.length > 0 ? this.modalStack[this.modalStack.length - 1] : null;
  }

  /**
   * Get the parent modal (second from top of stack)
   */
  getParentModal(): string | null {
    return this.modalStack.length > 1 ? this.modalStack[this.modalStack.length - 2] : null;
  }

  /**
   * Check if a modal is currently in the stack
   */
  isModalInStack(modalId: string): boolean {
    return this.modalStack.includes(modalId);
  }

  /**
   * Get the current stack depth
   */
  getStackDepth(): number {
    return this.modalStack.length;
  }

  /**
   * Clear the entire stack (use with caution)
   */
  clearStack(): void {
    this.modalStack = [];
    console.log('Modal stack cleared');
  }

  /**
   * Debug method to log current stack state
   */
  debugStack(): void {
    console.log('=== Modal Stack Debug ===');
    console.log('Current stack:', this.modalStack);
    console.log('Stack depth:', this.getStackDepth());
    console.log('Current modal:', this.getCurrentModal());
    console.log('Parent modal:', this.getParentModal());

    // Check DOM state of key modals
    const editVehicleModal = document.getElementById('editVehicle');
    const partDetailsModal = document.getElementById('partDetails');

    console.log('DOM Modal States:');
    console.log('- editVehicle:', editVehicleModal ? {
      exists: true,
      display: editVehicleModal.style.display,
      classes: editVehicleModal.className,
      ariaHidden: editVehicleModal.getAttribute('aria-hidden')
    } : { exists: false });
    console.log('- partDetails:', partDetailsModal ? {
      exists: true,
      display: partDetailsModal.style.display,
      classes: partDetailsModal.className,
      ariaHidden: partDetailsModal.getAttribute('aria-hidden')
    } : { exists: false });

    console.log('========================');
  }

  /**
   * Show a modal using Bootstrap's API with proper stack management
   */
  showModal(modalId: string, options: any = {}): void {
    // Only add to stack if not already present (prevents double addition from Bootstrap data attributes)
    if (!this.isModalInStack(modalId)) {
      this.pushModal(modalId);
    }

    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap?.Modal) {
        // For nested modals, remove fade to avoid open animation delay
        if (['partDetails', 'addNewPart', 'editPart'].includes(modalId)) {
          modal.classList.remove('fade');
        }

        // Get existing instance or create new one without custom options to avoid backdrop errors
        let modalInstance = bootstrap.Modal.getInstance(modal);
        if (!modalInstance) {
          modalInstance = new bootstrap.Modal(modal);
        }
        modalInstance.show();
      }
    }
  }

  /**
   * Hide a modal using Bootstrap's API with proper stack management
   */
  hideModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap?.Modal) {
        // Remove fade to skip close animation for fastest pop
        modal.classList.remove('fade');
        // Also ensure any backdrops skip transitions
        const backdrops = Array.from(document.querySelectorAll('.modal-backdrop')) as HTMLElement[];
        backdrops.forEach(b => {
          b.classList.remove('fade');
          b.style.opacity = b.style.opacity || '0';
        });

        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }

    this.popModal(modalId);
  }

  /**
   * Initialize Bootstrap modal event listeners for automatic stack management
   */
  initializeModalEventListeners(): void {
    // Prevent duplicate event listeners
    if ((window as any).modalStackListenersInitialized) {
      return;
    }
    (window as any).modalStackListenersInitialized = true;

    // Listen for all Bootstrap modal show events
    document.addEventListener('shown.bs.modal', (event: any) => {
      const modalElement = event.target;
      const modalId = modalElement.id;
      console.log(`Bootstrap shown.bs.modal event for modal: ${modalId}`);
      console.log(`Current stack before adding:`, this.modalStack);

      // Only handle nested modals, not the parent editVehicle modal
      if (modalId && !this.isModalInStack(modalId) && modalId !== 'editVehicle') {
        // Special handling for nested modals that should have editVehicle as parent
        if (['partDetails', 'addNewPart', 'editPart'].includes(modalId)) {
          // Ensure editVehicle is in the stack as parent
          if (!this.isModalInStack('editVehicle')) {
            console.log(`Adding editVehicle as parent for nested modal ${modalId}`);
            this.pushModal('editVehicle');
          }
        }

        console.log(`Auto-adding modal ${modalId} to stack via Bootstrap event`);
        this.pushModal(modalId);
        this.adjustBackdrops();
      } else if (modalId && this.isModalInStack(modalId)) {
        console.log(`Modal ${modalId} already in stack, skipping`);
      } else if (modalId === 'editVehicle') {
        console.log(`Skipping editVehicle - it's managed separately`);
      }
    });

    // Listen for all Bootstrap modal hide events
    document.addEventListener('hidden.bs.modal', (event: any) => {
      const modalElement = event.target;
      const modalId = modalElement.id;
      console.log(`Bootstrap hidden.bs.modal event for modal: ${modalId}`);
      console.log(`Current stack before removing:`, this.modalStack);

      if (modalId && this.isModalInStack(modalId)) {
        console.log(`Auto-removing modal ${modalId} from stack via Bootstrap event`);
        this.popModal(modalId);
        this.adjustBackdrops();
      }
    });
  }

  /**
   * Normalize/adjust backdrops so parent modal is not dimmed when nested modals are open
   */
  private adjustBackdrops(): void {
    const backdrops = Array.from(document.querySelectorAll('.modal-backdrop')) as HTMLElement[];
    const depth = this.modalStack.length;

    if (depth <= 1) {
      // Single modal: keep default opacity (let Bootstrap control)
      backdrops.forEach(b => {
        b.style.opacity = '';
        b.style.display = '';
      });
      return;
    }

    // Nested modals: ensure no backdrop dims the parent modal
    // Strategy: make all existing backdrops transparent to avoid dimming parent
    backdrops.forEach((b) => {
      b.style.opacity = '0';
      b.classList.add('show');
      b.style.display = 'block';
    });
  }

  /**
   * Force add a modal to the stack (useful for modals opened by Bootstrap data attributes)
   */
  forceAddModal(modalId: string): void {
    if (!this.isModalInStack(modalId)) {
      console.log(`Force adding modal ${modalId} to stack`);
      this.pushModal(modalId);
    } else {
      console.log(`Modal ${modalId} already in stack, skipping force add`);
    }
  }

  /**
   * Ensure a modal is visible and properly styled
   */
  private ensureModalVisible(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Ensure the modal is visible
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.removeAttribute('aria-hidden');

      // Ensure body has modal-open class
      document.body.classList.add('modal-open');

      // Ensure backdrop exists
      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }

      console.log(`Ensured modal ${modalId} is visible`);
    }
  }

  /**
   * Ensure a modal is visible immediately (optimized for performance)
   */
  private ensureModalVisibleImmediate(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Immediate visibility restoration without delays
      modal.classList.remove('fade');
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.removeAttribute('aria-hidden');

      // Ensure body has modal-open class
      document.body.classList.add('modal-open');

      // Ensure backdrop exists and is visible
      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop show';
        document.body.appendChild(backdrop);
      } else {
        // Make sure existing backdrop is visible
        backdrop.classList.remove('fade');
        backdrop.classList.add('show');
        (backdrop as HTMLElement).style.display = 'block';
      }

      console.log(`Immediately ensured modal ${modalId} is visible`);
    }
  }
}
