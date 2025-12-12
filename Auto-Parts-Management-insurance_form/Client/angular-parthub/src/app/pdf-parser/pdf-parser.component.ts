import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PdfParserService } from './pdf-parser.service';

@Component({
  selector: 'app-pdf-parser',
  templateUrl: './pdf-parser.component.html',
  styleUrls: ['./pdf-parser.component.css']
})
export class PdfParserComponent implements OnInit {

  selectedFile: File | null = null;
  parsedData: any = null;
  isParsing: boolean = false;
  isDragOver: boolean = false;
  errorMessage: string = '';

  constructor(
    private pdfParserService: PdfParserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // Drag and Drop Events
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  // File Selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Please select a valid PDF file.';
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      this.errorMessage = 'File size must be less than 50MB.';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
  }

  // Clear selected file
  clearFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
  }

  // Parse PDF
  async parsePDF(): Promise<void> {
    if (!this.selectedFile) return;

    this.isParsing = true;
    this.errorMessage = '';

    try {
      this.parsedData = await this.pdfParserService.parsePDF(this.selectedFile);
      console.log('Parsed Data:', this.parsedData);
    } catch (error) {
      console.error('Parsing error:', error);
      this.errorMessage = 'Failed to parse PDF. Please check if the file contains valid estimate data.';
    } finally {
      this.isParsing = false;
    }
  }

  // Helper methods for display
  getTotalLineItems(): number {
    if (!this.parsedData?.estimateData) return 0;
    return this.parsedData.estimateData.reduce((total: number, area: any) =>
      total + (area.claimItems?.length || 0), 0);
  }

  getVehicleDescription(): string {
    const vehicle = this.parsedData?.vehicleInfo;
    if (!vehicle) return 'N/A';
    return `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim() || 'N/A';
  }

  // Navigation and Actions
  viewInInsuranceViewer(): void {
    if (!this.parsedData) return;

    // Store parsed data in session storage to pass to insurance viewer
    sessionStorage.setItem('parsedEstimateData', JSON.stringify(this.parsedData));

    // Navigate to insurance viewing component with a flag to use parsed data
    this.router.navigate(['/insurance-viewing'], {
      queryParams: { source: 'pdf-parser' }
    });
  }

  downloadJSON(): void {
    if (!this.parsedData) return;

    const dataStr = JSON.stringify(this.parsedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estimate-data-${new Date().getTime()}.json`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  startOver(): void {
    this.selectedFile = null;
    this.parsedData = null;
    this.errorMessage = '';
    this.isParsing = false;
    this.isDragOver = false;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
