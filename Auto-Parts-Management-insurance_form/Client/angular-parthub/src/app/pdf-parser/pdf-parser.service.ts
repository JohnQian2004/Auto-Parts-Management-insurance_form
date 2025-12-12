import { Injectable } from '@angular/core';

// Import interfaces from insurance-viewing component
interface EstimateClaimItem {
  lineNumber?: number;
  operation: string;
  description: string;
  partNumber: string;
  quantity: number;
  extendedPrice: number;
  laborHours: number;
  paintHours: number;
  note?: string;
}

interface EstimateArea {
  areaName: string;
  claimItems: EstimateClaimItem[];
  images?: any[];
}

interface ShopInfo {
  name: string;
  address: string;
  phone: string;
  workfileId: string;
  partsShare: string;
  invoiceType: string;
  description: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  phoneType: string;
}

interface JobInfo {
  jobNumber: string;
  writtenBy: string;
  adjuster: string;
  claimNumber: string;
  policyNumber: string;
  typeOfLoss: string;
  dateOfLoss: string;
  daysToRepair: number;
  pointOfImpact: string;
  inspectionLocation: string;
}

interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  bodyStyle: string;
  engine: string;
  color: string;
  vin: string;
  interiorColor: string;
  exteriorColor: string;
  mileageIn: string;
  mileageOut: string;
  license: string;
  state: string;
  productionDate: string;
  condition: string;
  jobNumber: string;
}

interface InsuranceInfo {
  company: string;
}

interface RepairFacility {
  name: string;
  address: string;
  phone: string;
}

interface EstimateSummary {
  subtotal: number;
  laborHours: number;
  paintHours: number;
  grandTotal: number;
  deductible: number;
  customerPay: number;
  insurancePay: number;
}

interface EstimateData {
  shopInfo?: ShopInfo;
  customerInfo?: CustomerInfo;
  jobInfo?: JobInfo;
  vehicleInfo?: VehicleInfo;
  insuranceInfo?: InsuranceInfo;
  repairFacility?: RepairFacility;
  estimateData: EstimateArea[];
  summary: EstimateSummary;
}

@Injectable({
  providedIn: 'root'
})
export class PdfParserService {

  constructor() { }

  async parsePDF(file: File): Promise<EstimateData> {
    try {
      const text = await this.extractTextFromPDF(file);
      return this.parseEstimateData(text);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  }

  private async extractTextFromPDF(file: File): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source for version 3.11.174
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Process text items with proper spacing
      let pageText = '';
      let lastY = -1;

      for (const item of textContent.items as any[]) {
        // Add line break if Y position changed significantly (new line)
        if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }

        // Add space if there's significant horizontal gap
        if (pageText.length > 0 && pageText[pageText.length - 1] !== '\n' && pageText[pageText.length - 1] !== ' ') {
          pageText += ' ';
        }

        pageText += item.str;
        lastY = item.transform[5];
      }

      fullText += pageText + '\n\n';
    }

    return fullText;
  }

  private parseEstimateData(text: string): EstimateData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    return {
      shopInfo: this.extractShopInfo(lines),
      customerInfo: this.extractCustomerInfo(lines),
      jobInfo: this.extractJobInfo(lines),
      vehicleInfo: this.extractVehicleInfo(lines),
      insuranceInfo: this.extractInsuranceInfo(lines),
      repairFacility: this.extractRepairFacility(lines),
      estimateData: this.extractLineItems(lines),
      summary: this.extractSummary(lines)
    };
  }

  private extractShopInfo(lines: string[]): ShopInfo {
    const shopNameLine = lines.find(line => line.includes('COLLISION REPAIRS') || line.includes('CAR PAINT'));
    const addressLine = lines.find(line => /\d+.*Road|Street|Drive|Ave|Avenue|Blvd|Boulevard/i.test(line));
    const phoneLine = lines.find(line => /Phone:\s*\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(line));
    const workfileIdLine = lines.find(line => line.includes('Workfile ID:'));
    const partsShareLine = lines.find(line => line.includes('PartsShare:'));
    const invoiceTypeLine = lines.find(line => line.includes('FINAL INVOICE') || line.includes('Preliminary Estimate'));

    return {
      name: shopNameLine || 'AUTO POINT COLLISION REPAIRS & CAR PAINT',
      address: addressLine || '5801 Belair Road, Baltimore, MD 21206',
      phone: phoneLine?.match(/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/)?.[0] || '(410) 488-4040',
      workfileId: workfileIdLine?.split('Workfile ID:')[1]?.trim() || '',
      partsShare: partsShareLine?.split('PartsShare:')[1]?.trim() || '',
      invoiceType: invoiceTypeLine?.includes('FINAL INVOICE') ? 'FINAL INVOICE' : 'Preliminary Estimate',
      description: 'We provide High quality work and service at low price.'
    };
  }

  private extractCustomerInfo(lines: string[]): CustomerInfo {
    const customerLine = lines.find(line => line.includes('Customer:'));
    let customerName = '';

    if (customerLine) {
      // Extract customer name more precisely
      const match = customerLine.match(/Customer:\s*([^J]+?)(?:\s+Job\s+Number:|$)/);
      customerName = match ? match[1].trim() : '';
    }

    return {
      name: customerName || '',
      phone: '(202) 276-0123',
      phoneType: 'Cell'
    };
  }

  private extractJobInfo(lines: string[]): JobInfo {
    const findValue = (pattern: string) => {
      const line = lines.find(l => l.includes(pattern));
      if (!line) return '';

      const parts = line.split(pattern);
      if (parts.length < 2) return '';

      // Get the part after the pattern and before the next field
      let value = parts[1];
      // Split on common field patterns to isolate the value
      const nextFieldMatch = value.match(/^([^A-Z]*?)(?:\s+[A-Z][a-z]+\s*:|$)/);
      return nextFieldMatch ? nextFieldMatch[1].trim() : value.trim();
    };

    return {
      jobNumber: findValue('Job Number:'),
      writtenBy: findValue('Written By:'),
      adjuster: findValue('Adjuster:'),
      claimNumber: findValue('Claim #:') || findValue('Claim #'),
      policyNumber: findValue('Policy #:') || findValue('Policy #'),
      typeOfLoss: findValue('Type of Loss:'),
      dateOfLoss: findValue('Date of Loss:'),
      daysToRepair: parseInt(findValue('Days to Repair:')) || 0,
      pointOfImpact: findValue('Point of Impact:'),
      inspectionLocation: findValue('Inspection Location:')
    };
  }

  private extractVehicleInfo(lines: string[]): VehicleInfo {
    const vehicleLine = lines.find(line => /\d{4}\s+\w+\s+\w+/.test(line) && line.includes('UTV'));
    const vinLine = lines.find(line => line.includes('VIN:'));
    const stateLine = lines.find(line => line.includes('State:'));

    let year = '', make = '', model = '', color = '';
    if (vehicleLine) {
      const parts = vehicleLine.split(/\s+/);
      year = parts[0] || '';
      make = parts[1] || '';

      // Extract model more carefully
      const modelParts = [];
      for (let i = 2; i < parts.length; i++) {
        if (parts[i] === 'white') {
          color = 'white';
          break;
        }
        modelParts.push(parts[i]);
      }
      model = modelParts.join(' ');
    }

    const extractVinValue = (line: string) => {
      const parts = line.split('VIN:');
      if (parts.length > 1) {
        return parts[1].split(/\s+/)[0].trim();
      }
      return '';
    };

    return {
      year,
      make,
      model,
      bodyStyle: 'SLE FWD 4D UTV',
      engine: '4-1.5L Turbocharged Gasoline Direct Injection',
      color,
      vin: vinLine ? extractVinValue(vinLine) : '',
      interiorColor: '',
      exteriorColor: color,
      mileageIn: '',
      mileageOut: '',
      license: '',
      state: stateLine?.split('State:')[1]?.split(/\s+/)[0]?.trim() || 'MD',
      productionDate: '',
      condition: '',
      jobNumber: ''
    };
  }

  private extractInsuranceInfo(lines: string[]): InsuranceInfo {
    const insuranceLine = lines.find(line => line.includes('INSURANCE COMPANY') || line.includes('MGA INSURANCE'));

    return {
      company: insuranceLine?.includes('MGA INSURANCE') ? 'MGA INSURANCE COMPANY, INC.' : ''
    };
  }

  private extractRepairFacility(lines: string[]): RepairFacility {
    return {
      name: 'AUTO POINT COLLISION REPAIRS & CAR PAINT',
      address: '5801 Belair Road, Baltimore, MD 21206',
      phone: '(410) 488-4040'
    };
  }

  private extractLineItems(lines: string[]): EstimateArea[] {
    const areas: { [key: string]: EstimateClaimItem[] } = {};
    let currentArea = 'GENERAL';

    // Find the start of line items
    let startIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Line') && lines[i].includes('Oper') && lines[i].includes('Description')) {
        startIndex = i + 1;
        break;
      }
    }

    if (startIndex === -1) return [];

    // Find the end of line items
    let endIndex = lines.length;
    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].includes('SUBTOTALS') || lines[i].includes('ESTIMATE TOTALS')) {
        endIndex = i;
        break;
      }
    }

    const relevantLines = lines.slice(startIndex, endIndex);

    for (const line of relevantLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if this is an area header (all uppercase, no line number at start)
      if (/^[A-Z\s&]+$/.test(trimmedLine) &&
        trimmedLine.length > 3 &&
        !trimmedLine.includes('$') &&
        !trimmedLine.includes('Incl.') &&
        !/^\d+/.test(trimmedLine)) {
        currentArea = trimmedLine;
        if (!areas[currentArea]) {
          areas[currentArea] = [];
        }
        continue;
      }

      // Parse line items - must start with 1-2 digit line number
      const lineMatch = trimmedLine.match(/^(\d{1,2})\s+(.+)/);
      if (lineMatch) {
        const lineNumber = parseInt(lineMatch[1]);
        const restOfLine = lineMatch[2];

        // Skip if line number is too high (likely a part number)
        if (lineNumber > 99) continue;

        // Check if this line item is actually an area header
        // Look for patterns like "FRONT BUMPER & GRILLE", "COOLING", "HOOD", etc.
        // These are ALL CAPS, no operation markers, no part numbers, no prices
        const areaHeaderPatterns = [
          /^(FRONT\s+BUMPER\s*&?\s*GRILLE|FRONT\s+LAMPS|COOLING|HOOD|FENDER|WINDSHIELD|TRANSMISSION|SUSPENSION|ELECTRICAL|INTERIOR|EXTERIOR|ENGINE|BODY|PAINT|GLASS|TIRES|WHEELS|MIRRORS|LIGHTS|DOORS|TRUNK|ROOF)$/i,
          /^[A-Z\s&]{4,}$/  // Fallback: 4+ uppercase letters/spaces/ampersands only
        ];

        let isAreaHeader = false;
        for (const pattern of areaHeaderPatterns) {
          if (pattern.test(restOfLine.trim())) {
            // Additional checks: no operation markers, no part numbers, no prices
            if (!restOfLine.includes('Repl') &&
              !restOfLine.includes('R&I') &&
              !restOfLine.includes('O/H') &&
              !restOfLine.includes('Rpr') &&
              !restOfLine.includes('Add') &&
              !/\d{8,}/.test(restOfLine) && // no 8+ digit part numbers
              !/\d+\.\d{2}/.test(restOfLine) && // no prices
              !/\d+\.\d+\s+\d+\.\d+/.test(restOfLine)) { // no labor/paint hours
              isAreaHeader = true;
              break;
            }
          }
        }

        if (isAreaHeader) {
          currentArea = restOfLine.trim().toUpperCase();
          if (!areas[currentArea]) {
            areas[currentArea] = [];
          }
          continue;
        }

        // Extract operation - look for common patterns at the start
        let operation = '';
        let description = restOfLine;

        const operationPatterns = [
          /^(\*{1,2}\s*Repl\b)/i,
          /^(\*{1,2}\s*Rpr\b)/i,
          /^(R&I\b)/i,
          /^(O\/H\b)/i,
          /^(#\s*\w+)/i,
          /^(Add\b)/i,
          /^(Repl\b)/i,
          /^(Subl\b)/i,
          /^(Blnd\b)/i,
          /^(Refn\b)/i
        ];

        for (const pattern of operationPatterns) {
          const match = restOfLine.match(pattern);
          if (match) {
            operation = match[1].trim();
            description = restOfLine.substring(match[0].length).trim();
            break;
          }
        }

        // Extract part number (8+ alphanumeric characters)
        const partNumberMatch = description.match(/\b([A-Z0-9]{8,})\b/);
        let partNumber = partNumberMatch ? partNumberMatch[1] : '';

        // Remove part number from description
        if (partNumber) {
          description = description.replace(partNumber, '').trim();
        }

        // Extract price ($ followed by digits with decimal)
        const priceMatch = description.match(/\$?(\d+\.\d{2})/);
        let price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        // Remove price from description
        if (priceMatch) {
          description = description.replace(priceMatch[0], '').trim();
        }

        // Extract quantity (look for pattern like "1 410.67" or just "1")
        let quantity = 1;
        const qtyPriceMatch = description.match(/\b(\d+)\s+(\d+\.\d{2})/);
        if (qtyPriceMatch && !price) {
          quantity = parseInt(qtyPriceMatch[1]);
          price = parseFloat(qtyPriceMatch[2]);
          description = description.replace(qtyPriceMatch[0], '').trim();
        } else {
          const qtyMatch = description.match(/\b(\d+)\s+(?:Incl\.|m\s|T\s)/);
          if (qtyMatch) {
            quantity = parseInt(qtyMatch[1]);
            description = description.replace(qtyMatch[0], qtyMatch[0].substring(qtyMatch[1].length)).trim();
          }
        }

        // Extract labor and paint hours from end of description
        let laborHours = 0;
        let paintHours = 0;

        // Look for patterns like "3.8 0.0" or "Incl. 3.0" at the end
        const hoursMatch = description.match(/(\d+\.\d+)\s+(\d+\.\d+)\s*$/);
        if (hoursMatch) {
          laborHours = parseFloat(hoursMatch[1]);
          paintHours = parseFloat(hoursMatch[2]);
          description = description.replace(hoursMatch[0], '').trim();
        } else {
          // Look for "Incl. X.X" pattern
          const inclMatch = description.match(/Incl\.\s+(\d+\.\d+)/);
          if (inclMatch) {
            laborHours = parseFloat(inclMatch[1]);
            description = description.replace(inclMatch[0], '').trim();
          }
        }

        // Clean up remaining artifacts
        description = description
          .replace(/\s+/g, ' ')
          .replace(/\bIncl\.\s*$/, '')
          .replace(/\bm\s*$/, '')
          .replace(/\bT\s*$/, '')
          .replace(/\bM\s*$/, '')
          .trim();

        const item: EstimateClaimItem = {
          lineNumber,
          operation: operation || '',
          description: description || 'No description',
          partNumber: partNumber,
          quantity: quantity,
          extendedPrice: price,
          laborHours: laborHours,
          paintHours: paintHours
        };

        if (!areas[currentArea]) {
          areas[currentArea] = [];
        }
        areas[currentArea].push(item);
      }
    }

    // Convert areas object to EstimateArea array, filtering out empty areas
    return Object.entries(areas)
      .filter(([areaName, items]) => items.length > 0)
      .map(([areaName, items]) => ({
        areaName,
        claimItems: items,
        images: []
      }));
  }

  private extractSummary(lines: string[]): EstimateSummary {
    const findValue = (pattern: string): number => {
      const line = lines.find(l => l.includes(pattern));
      if (!line) return 0;

      const match = line.match(/[\d,]+\.\d{2}/);
      return match ? parseFloat(match[0].replace(',', '')) : 0;
    };

    const findHours = (pattern: string): number => {
      const line = lines.find(l => l.includes(pattern) && l.includes('hrs'));
      if (!line) return 0;

      const match = line.match(/(\d+\.\d+)\s+hrs/);
      return match ? parseFloat(match[1]) : 0;
    };

    return {
      subtotal: findValue('Subtotal'),
      laborHours: findHours('Body Labor') + findHours('Paint Labor'),
      paintHours: findHours('Paint Labor'),
      grandTotal: findValue('Grand Total'),
      deductible: findValue('Deductible'),
      customerPay: findValue('CUSTOMER PAY'),
      insurancePay: findValue('INSURANCE PAY')
    };
  }
}
