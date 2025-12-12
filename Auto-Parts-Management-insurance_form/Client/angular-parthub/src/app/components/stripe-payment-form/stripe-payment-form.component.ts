import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, Inject, PLATFORM_ID, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-stripe-payment-form',
  templateUrl: './stripe-payment-form.component.html',
  styleUrls: ['./stripe-payment-form.component.css']
})
export class StripePaymentFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() amount: number = 0;
  @Input() currency: string = 'usd';
  @Input() description: string = '';
  @Input() isVisible: boolean = false;
  
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentError = new EventEmitter<string>();
  @Output() paymentCancel = new EventEmitter<void>();

  // Cardholder and billing information (pre-filled for testing)
  cardholderInfo = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567'
  };

  billingAddress = {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
  };

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  
  isProcessing = false;
  error: string | null = null;
  isStripeLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.initializeStripe();
    }
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      // Modal is becoming visible, reinitialize Stripe
      setTimeout(() => {
        this.reinitializeStripe();
      }, 200);
    }
  }

  private async initializeStripe() {
    try {
      this.stripe = await loadStripe(environment.stripe.publishableKey);
      this.isStripeLoaded = true;
      
      if (this.stripe && this.isVisible) {
        await this.createElements();
      }
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      this.paymentError.emit('Failed to load payment system');
    }
  }

  private async createElements() {
    if (!this.stripe) return;

    // Check if the DOM element exists
    const cardElementDiv = document.getElementById('card-element');
    if (!cardElementDiv) {
      console.warn('Card element container not found, retrying...');
      setTimeout(() => this.createElements(), 100);
      return;
    }

    this.elements = this.stripe.elements({
      mode: 'subscription',
      currency: this.currency,
      amount: Math.round(this.amount * 100), // Convert to cents
    });

    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });

    try {
      this.cardElement.mount('#card-element');
      
      this.cardElement.on('change', (event) => {
        if (event.error) {
          this.error = event.error.message;
        } else {
          this.error = null;
        }
      });
      
      console.log('Stripe card element mounted successfully');
    } catch (error) {
      console.error('Failed to mount Stripe card element:', error);
      this.error = 'Failed to initialize payment form';
    }
  }

  async processPayment() {
    if (!this.stripe || !this.cardElement) {
      this.paymentError.emit('Payment system not ready');
      return;
    }

    // Check if card element is properly mounted
    const cardElementDiv = document.getElementById('card-element');
    if (!cardElementDiv || cardElementDiv.children.length === 0) {
      this.error = 'Payment form not ready. Please wait for the card input to load.';
      this.paymentError.emit(this.error);
      return;
    }

    // Validate required fields
    if (!this.cardholderInfo.name || !this.cardholderInfo.email) {
      this.error = 'Please fill in all required cardholder information';
      this.paymentError.emit(this.error);
      return;
    }

    if (!this.billingAddress.street || !this.billingAddress.city || !this.billingAddress.state || !this.billingAddress.zipCode) {
      this.error = 'Please fill in all required billing address fields';
      this.paymentError.emit(this.error);
      return;
    }

    this.isProcessing = true;
    this.error = null;

    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          name: this.cardholderInfo.name,
          email: this.cardholderInfo.email,
          phone: this.cardholderInfo.phone,
          address: {
            line1: this.billingAddress.street,
            city: this.billingAddress.city,
            state: this.billingAddress.state,
            postal_code: this.billingAddress.zipCode,
            country: this.billingAddress.country
          }
        }
      });

      if (error) {
        this.error = error.message || 'Payment failed';
        this.paymentError.emit(this.error);
        this.isProcessing = false;
        return;
      }

      // Emit payment method for parent component to handle
      this.paymentSuccess.emit({
        paymentMethod,
        amount: this.amount,
        currency: this.currency,
        description: this.description
      });

    } catch (err: any) {
      this.error = err.message || 'Payment processing failed';
      this.paymentError.emit(this.error || 'Payment processing failed');
    } finally {
      this.isProcessing = false;
    }
  }

  cancelPayment() {
    this.paymentCancel.emit();
  }

  // Called when modal becomes visible
  async onModalShow() {
    if (this.isStripeLoaded && !this.elements) {
      await this.createElements();
    }
  }

  // Method to reinitialize Stripe when component becomes visible
  async reinitializeStripe() {
    if (this.isStripeLoaded && this.isVisible) {
      // Destroy existing elements if they exist
      if (this.cardElement) {
        this.cardElement.destroy();
        this.cardElement = null;
      }
      if (this.elements) {
        this.elements = null;
      }
      
      // Wait a bit for DOM to be ready
      setTimeout(async () => {
        await this.createElements();
      }, 100);
    }
  }

  // Copy test card number to clipboard
  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      // Show a brief success message (you could add a toast notification here)
      console.log('Card number copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}
