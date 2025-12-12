import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-vehicle-detail-test',
    template: `<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: red; z-index: 999999;">
      <h1 style="color: white; text-align: center; padding-top: 200px; font-size: 48px;">BASIC TEST</h1>
    </div>`
})
export class VehicleDetailTestComponent implements OnInit {
    @Input() vehicle: any;
    @Input() payments: any[] = [];

    constructor() {
        console.log('💰 VEHICLE + PAYMENTS TEST COMPONENT CREATED!');
    }

    ngOnInit() {
        console.log('💰 Vehicle received:', this.vehicle);
        console.log('💰 Payments received:', this.payments);
        console.log('💰 Template should be rendering now...');
        alert(`💰 Vehicle: ${this.vehicle?.year} ${this.vehicle?.make} ${this.vehicle?.model} | Payments: ${this.payments?.length || 0}`);

        // Force a DOM check
        setTimeout(() => {
            console.log('💰 DOM Check: Component element exists?', document.querySelector('app-vehicle-detail-test'));
        }, 100);
    }

    getVehicleInfo(): string {
        return `${this.vehicle?.year || 'N/A'} ${this.vehicle?.make || 'N/A'} ${this.vehicle?.model || 'N/A'} (ID: ${this.vehicle?.id || 'N/A'})`;
    }

    getPaymentsCount(): number {
        return this.payments?.length || 0;
    }

    getPaymentsType(): string {
        return this.payments ? 'Array' : 'NULL/UNDEFINED';
    }

    getPaymentInfo(payment: any, index: number): string {
        return `Payment ${index + 1}: $${payment?.amount || 'N/A'} - ${payment?.name || 'No Name'}`;
    }

    debugClick(): void {
        console.log('🎯 MODAL CLICKED! Template is definitely rendering and clickable!');
        alert('🎯 MODAL CLICKED! Template is working!');
    }
}