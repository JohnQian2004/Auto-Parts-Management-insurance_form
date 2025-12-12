import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { Vehicle } from '../models/vehicle.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface SearchCarrier {
    companyId: number;
    userId?: number;
    archived: boolean;
    type: number;
    pageSize: number;
    pageNumber: number;
    partNumber: string;
    vin?: string;
    year?: string;
    make?: string;
    model?: string;
    color?: string;
    licensePlate?: string;
    searchCount?: number;
}

export interface ReportConfig {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    parameters?: any;
}

@Injectable({
    providedIn: 'root',
})
export class ReportService {

    config: Config = new Config();

    API_URL_SEARCH_VEHICLES = this.config.baseUrl + '/reports/search-vehicles';
    API_URL_VEHICLES_WITH_NESTED_DATA = this.config.baseUrl + '/reports/vehicles-with-nested-data';
    API_URL_VEHICLES_WITH_NESTED_DATA_PAYMENT_TRACKING = this.config.baseUrl + '/reports/vehicles-with-nested-data-payment-tracking';

    constructor(private http: HttpClient) { }

    searchVehiclesForReports(searchCarrier: SearchCarrier): Observable<Vehicle[]> {
        return this.http.post<Vehicle[]>(this.API_URL_SEARCH_VEHICLES, searchCarrier, httpOptions);
    }

    getVehiclesWithNestedData(
        companyId: any,
        includeCollections?: string[],
        status?: string,
        paymentStatus?: string
    ): Observable<Vehicle[]> {
        let params = new HttpParams()
            .set('companyId', companyId.toString());

        if (includeCollections && includeCollections.length > 0) {
            includeCollections.forEach(collection => {
                params = params.append('includeCollections', collection);
            });
        }

        if (status) {
            params = params.set('status', status);
        }

        if (paymentStatus) {
            params = params.set('paymentStatus', paymentStatus);
        }

        return this.http.get<Vehicle[]>(this.API_URL_VEHICLES_WITH_NESTED_DATA, { params });
    }

    // Convenience methods for specific collection loading
    getVehiclesWithPayments(companyId: any): Observable<Vehicle[]> {
        return this.getVehiclesWithNestedData(companyId, ['payments']);
    }

    getVehiclesWithReceipts(companyId: any): Observable<Vehicle[]> {
        return this.getVehiclesWithNestedData(companyId, ['receipts']);
    }

    getVehiclesWithSupplements(companyId: any): Observable<Vehicle[]> {
        return this.getVehiclesWithNestedData(companyId, ['supplements']);
    }

    getVehiclesWithPaymentsAndReceipts(companyId: any): Observable<Vehicle[]> {
        return this.getVehiclesWithNestedData(companyId, ['payments', 'receipts']);
    }

    getCurrentShopVehiclesSummary(companyId: any): Observable<Vehicle[]> {
        const searchCarrier: SearchCarrier = {
            companyId: companyId,
            archived: false,
            type: 5, // All vehicles for company
            pageSize: 1000,
            pageNumber: 0,
            partNumber: ''
        };

        return this.searchVehiclesForReports(searchCarrier);
    }

    getVehiclesWithPaymentTracking(companyId: any): Observable<Vehicle[]> {
        const includeCollections = ['payments', 'receipts', 'supplements'];

        return this.getVehiclesWithNestedData(
            companyId,
            includeCollections,
            'current', // status
            'all' // paymentStatus
        );
    }

    getVehiclesWithNestedDataPaymentTracking(
        companyId: any,
        includeCollections?: string[],
        status?: string,
        paymentStatus?: string,
        searchCarrier?: SearchCarrier,
        dateCarrier?: any
    ): Observable<Vehicle[]> {
        let params = new HttpParams()
            .set('companyId', companyId.toString());

        if (includeCollections && includeCollections.length > 0) {
            includeCollections.forEach(collection => {
                params = params.append('includeCollections', collection);
            });
        }

        if (status) {
            params = params.set('status', status);
        }

        if (paymentStatus) {
            params = params.set('paymentStatus', paymentStatus);
        }

        // Add date parameters if dateCarrier is provided
        if (dateCarrier) {
            params = params.set('dateFrom', dateCarrier.from.toString());
            params = params.set('dateTo', dateCarrier.to.toString());
        }

        // Use POST with SearchCarrier in body for more complex filtering
        const body = searchCarrier || {
            companyId: companyId,
            archived: false,
            type: 5, // All vehicles for company
            pageSize: 1000,
            pageNumber: 0,
            partNumber: ''
        };

        return this.http.post<Vehicle[]>(this.API_URL_VEHICLES_WITH_NESTED_DATA_PAYMENT_TRACKING, body, {
            headers: httpOptions.headers,
            params: params
        });
    }

    getAvailableReports(): ReportConfig[] {
        return [
            {
                id: 'current-shop-summary',
                name: 'Current Shop Vehicles Summary',
                description: 'Overview of all current shop vehicles with key business information',
                endpoint: 'search-vehicles',
                parameters: { type: 5, archived: false }
            },
            {
                id: 'payment-tracking',
                name: 'Current Shop Vehicles Summary With Payment Tracking',
                description: 'Detailed payment tracking and status for all vehicles',
                endpoint: 'vehicles-with-nested-data',
                parameters: { includeCollections: ['payments', 'receipts', 'supplements'] }
            }
        ];
    }

    calculateReportMetrics(vehicles: Vehicle[]): any {
        const totalVehicles = vehicles.length;
        const paidVehicles = vehicles.filter(v => v.paid === true).length;
        const unpaidVehicles = totalVehicles - paidVehicles;

        const totalEstimate = vehicles.reduce((total, vehicle) => {
            const basePrice = vehicle.price || 0;
            const supplementPrice = vehicle.supplymentPrice || 0;
            const supplementsTotal = vehicle.supplements ?
                vehicle.supplements.reduce((sum, supplement) => sum + (supplement.price || 0), 0) : 0;
            return total + basePrice + supplementPrice + supplementsTotal;
        }, 0);

        const averageEstimate = totalVehicles > 0 ? totalEstimate / totalVehicles : 0;

        return {
            totalVehicles,
            paidVehicles,
            unpaidVehicles,
            totalEstimate,
            averageEstimate
        };
    }

    calculatePaymentMetrics(vehicles: Vehicle[]): any {
        let totalPayments = 0;
        let totalReceipts = 0;
        let totalPaymentAmount = 0;
        let totalReceiptAmount = 0;
        let totalEstimate = 0;
        let totalSupplementsAmount = 0;
        let vehiclesWithPayments = 0;
        let vehiclesWithReceipts = 0;

        vehicles.forEach(vehicle => {
            // Calculate estimate for this vehicle
            const basePrice = vehicle.price || 0;
            const supplementPrice = vehicle.supplymentPrice || 0;
            const supplementsTotal = vehicle.supplements ?
                vehicle.supplements.reduce((sum, supplement) => sum + (supplement.price || 0), 0) : 0;
            const vehicleEstimate = basePrice + supplementPrice + supplementsTotal;
            totalEstimate += vehicleEstimate;
            totalSupplementsAmount += supplementsTotal;

            // Count and sum payments
            if (vehicle.payments && vehicle.payments.length > 0) {
                vehiclesWithPayments++;
                totalPayments += vehicle.payments.length;
                totalPaymentAmount += vehicle.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
            }

            // Count and sum receipts
            if (vehicle.receipts && vehicle.receipts.length > 0) {
                vehiclesWithReceipts++;
                totalReceipts += vehicle.receipts.length;
                totalReceiptAmount += vehicle.receipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
            }
        });

        const outstandingAmount = totalEstimate - totalPaymentAmount;
        const paymentCompletionRate = totalEstimate > 0 ? (totalPaymentAmount / totalEstimate) * 100 : 0;

        return {
            totalPayments,
            totalReceipts,
            totalPaymentAmount,
            totalReceiptAmount,
            totalEstimate,
            totalSupplementsAmount,
            outstandingAmount,
            paymentCompletionRate,
            vehiclesWithPayments,
            vehiclesWithReceipts,
            averagePaymentPerVehicle: vehiclesWithPayments > 0 ? totalPaymentAmount / vehiclesWithPayments : 0,
            averageReceiptPerVehicle: vehiclesWithReceipts > 0 ? totalReceiptAmount / vehiclesWithReceipts : 0
        };
    }

    // Utility methods for report analysis
    getVehiclesWithOutstandingPayments(vehicles: Vehicle[]): Vehicle[] {
        return vehicles.filter(vehicle => {
            const basePrice = vehicle.price || 0;
            const supplementPrice = vehicle.supplymentPrice || 0;
            const supplementsTotal = vehicle.supplements ?
                vehicle.supplements.reduce((sum, supplement) => sum + (supplement.price || 0), 0) : 0;
            const totalEstimate = basePrice + supplementPrice + supplementsTotal;

            const totalPayments = vehicle.payments ?
                vehicle.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0) : 0;

            return totalEstimate > totalPayments;
        });
    }

    getVehiclesWithCompletePayments(vehicles: Vehicle[]): Vehicle[] {
        return vehicles.filter(vehicle => {
            const basePrice = vehicle.price || 0;
            const supplementPrice = vehicle.supplymentPrice || 0;
            const supplementsTotal = vehicle.supplements ?
                vehicle.supplements.reduce((sum, supplement) => sum + (supplement.price || 0), 0) : 0;
            const totalEstimate = basePrice + supplementPrice + supplementsTotal;

            const totalPayments = vehicle.payments ?
                vehicle.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0) : 0;

            return totalEstimate <= totalPayments && totalEstimate > 0;
        });
    }

    getVehiclesWithoutPayments(vehicles: Vehicle[]): Vehicle[] {
        return vehicles.filter(vehicle => !vehicle.payments || vehicle.payments.length === 0);
    }

    getVehiclesWithoutReceipts(vehicles: Vehicle[]): Vehicle[] {
        return vehicles.filter(vehicle => !vehicle.receipts || vehicle.receipts.length === 0);
    }

    // Method to get payment status summary
    getPaymentStatusSummary(vehicles: Vehicle[]): any {
        const outstanding = this.getVehiclesWithOutstandingPayments(vehicles);
        const complete = this.getVehiclesWithCompletePayments(vehicles);
        const noPayments = this.getVehiclesWithoutPayments(vehicles);

        return {
            total: vehicles.length,
            outstanding: outstanding.length,
            complete: complete.length,
            noPayments: noPayments.length,
            outstandingPercentage: vehicles.length > 0 ? (outstanding.length / vehicles.length) * 100 : 0,
            completePercentage: vehicles.length > 0 ? (complete.length / vehicles.length) * 100 : 0,
            noPaymentsPercentage: vehicles.length > 0 ? (noPayments.length / vehicles.length) * 100 : 0
        };
    }
}
