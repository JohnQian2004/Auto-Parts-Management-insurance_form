import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { InsurancerService } from '../_services/insurancer.service';
import { Insurancer } from '../models/insurancer.model';

@Component({
  selector: 'app-insurance-management',
  templateUrl: './insurance-management.component.html',
  styleUrls: ['./insurance-management.component.css']
})
export class InsuranceManagementComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // Forms
  insurancerForm: FormGroup;
  tokenForm: FormGroup;

  // Data
  insurancers: Insurancer[] = [];
  filteredInsurancers: Insurancer[] = [];

  // UI States
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  showTokenForm: boolean = false;
  showModal: boolean = false;
  selectedInsurancer: Insurancer | null = null;

  // Search and filtering
  searchTerm: string = '';
  currentCompanyId: number = 1; // Default company ID

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private insurancerService: InsurancerService
  ) {
    this.insurancerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactFirstName: ['', Validators.required],
      contactLastName: ['', Validators.required],
      url: ['', [Validators.pattern('https?://.+')]],
      phone: ['', [Validators.pattern('^[+]?[0-9\\s\\-\\(\\)]+$')]],
      phone2: ['', [Validators.pattern('^[+]?[0-9\\s\\-\\(\\)]+$')]],
      phone3: ['', [Validators.pattern('^[+]?[0-9\\s\\-\\(\\)]+$')]],
      email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });

    this.tokenForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(36)]]
    });
  }

  ngOnInit(): void {
    this.loadInsurancers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Modal methods
  openAddModal(): void {
    this.selectedInsurancer = null;
    this.insurancerForm.reset();
    this.showModal = true;
    this.clearMessages();
  }

  openEditModal(insurancer: Insurancer): void {
    this.selectedInsurancer = insurancer;
    this.insurancerForm.patchValue({
      name: insurancer.name,
      contactFirstName: insurancer.contactFirstName,
      contactLastName: insurancer.contactLastName,
      url: insurancer.url,
      phone: insurancer.phone,
      phone2: insurancer.phone2,
      phone3: insurancer.phone3,
      email: insurancer.email,
      notes: insurancer.notes
    });
    this.showModal = true;
    this.clearMessages();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedInsurancer = null;
    this.insurancerForm.reset();
    this.clearMessages();
  }

  loadInsurancers(): void {
    this.isLoading = true;

    this.insurancerService.getAllCompanyInsurancer(this.currentCompanyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (insurancers: Insurancer[]) => {
          this.insurancers = insurancers;
          this.filteredInsurancers = [...insurancers];
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading insurancers:', error);
          this.errorMessage = 'Error loading insurance companies. Please try again.';
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.insurancerForm.valid) {
      this.createInsurancer();
    }
  }

  private createInsurancer(): void {
    this.isSubmitting = true;
    this.errorMessage = '';

    const insurancerData = this.insurancerForm.value;

    this.insurancerService.createInsurancer(this.currentCompanyId, insurancerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (insurancer: Insurancer) => {
          this.insurancers.push(insurancer);
          this.filteredInsurancers = [...this.insurancers];
          this.successMessage = 'Insurance company created successfully!';
          this.closeModal();
          this.isSubmitting = false;

          // Auto-generate token
          this.generateToken(insurancer);

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error: any) => {
          console.error('Error creating insurancer:', error);
          this.errorMessage = 'Error creating insurance company. Please try again.';
          this.isSubmitting = false;
        }
      });
  }

  generateToken(insurancer: Insurancer): void {
    this.insurancerService.generateUniqueToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (token: string) => {
          this.updateInsurancerToken(insurancer.id!, token);
        },
        error: (error: any) => {
          console.error('Error generating token:', error);
          this.errorMessage = 'Error generating token. Please try again.';
        }
      });
  }

  private updateInsurancerToken(insurancerId: number, token: string): void {
    this.insurancerService.updateInsurancerToken(insurancerId, token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedInsurancer: Insurancer) => {
          // Update the insurancer in the list
          const index = this.insurancers.findIndex(i => i.id === insurancerId);
          if (index !== -1) {
            this.insurancers[index] = updatedInsurancer;
            this.filteredInsurancers = [...this.insurancers];
          }

          this.successMessage = `Token generated and assigned: ${token}`;

          // Clear success message after 10 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 10000);
        },
        error: (error: any) => {
          console.error('Error updating token:', error);
          this.errorMessage = 'Error updating token. Please try again.';
        }
      });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInsurancers = [...this.insurancers];
      return;
    }

    this.insurancerService.searchInsurancers(this.searchTerm, this.currentCompanyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: Insurancer[]) => {
          this.filteredInsurancers = results;
        },
        error: (error: any) => {
          console.error('Error searching insurancers:', error);
          this.filteredInsurancers = [];
        }
      });
  }

  onEdit(insurancer: Insurancer): void {
    this.openEditModal(insurancer);
  }

  onUpdate(): void {
    if (this.insurancerForm.valid && this.selectedInsurancer) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const updateData = this.insurancerForm.value;

      this.insurancerService.updateInsurancer(this.selectedInsurancer.id!, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedInsurancer: Insurancer) => {
            // Update the insurancer in the list
            const index = this.insurancers.findIndex(i => i.id === updatedInsurancer.id);
            if (index !== -1) {
              this.insurancers[index] = updatedInsurancer;
              this.filteredInsurancers = [...this.insurancers];
            }

            this.successMessage = 'Insurance company updated successfully!';
            this.closeModal();
            this.isSubmitting = false;

            // Clear success message after 5 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (error: any) => {
            console.error('Error updating insurancer:', error);
            this.errorMessage = 'Error updating insurance company. Please try again.';
            this.isSubmitting = false;
          }
        });
    }
  }

  onDelete(insurancer: Insurancer): void {
    if (confirm(`Are you sure you want to delete ${insurancer.name}?`)) {
      this.insurancerService.deleteInsurancer(insurancer.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.insurancers = this.insurancers.filter(i => i.id !== insurancer.id);
            this.filteredInsurancers = [...this.insurancers];
            this.successMessage = 'Insurance company deleted successfully!';

            // Clear success message after 5 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (error: any) => {
            console.error('Error deleting insurancer:', error);
            this.errorMessage = 'Error deleting insurance company. Please try again.';
          }
        });
    }
  }

  onRegenerateToken(insurancer: Insurancer): void {
    if (confirm(`Regenerate token for ${insurancer.name}?`)) {
      this.generateToken(insurancer);
    }
  }

  onCopyToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
      this.successMessage = 'Token copied to clipboard!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }).catch(() => {
      this.errorMessage = 'Failed to copy token to clipboard.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    });
  }

  onCancel(): void {
    this.closeModal();
  }

  getTokenDisplay(token: string | undefined): string {
    if (!token) return 'No token assigned';
    return `${token.substring(0, 8)}...${token.substring(token.length - 8)}`;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
