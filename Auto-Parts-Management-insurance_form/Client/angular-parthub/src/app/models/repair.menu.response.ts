export class RepairMenuResponse {
    repairMenu: RepairMenu = new RepairMenu();
}

export class RepairMenu {
    repairRequest: string = "";
    sections: Section[] = new Array();
}

export class Section {
    title: string = "";
    items: (RepairTask | FluidItem | EstimateItem)[] = new Array();
}

export class RepairTask {
    description: string = "";
    type: string = "";
    item: string = "";
    spec?: string = "";
    details?: string = "";
    labor_hours: number = 0;
    estimated_cost_usd_fron: number = 0;
    estimated_cost_usd_to: number = 0;
}

export class FluidItem {
    type: string = "";
    item: string = "";
    spec?: string = "";
    details?: string = "";
    description: string = "";
    quantity_quarts?: number;
    quantity_gallons?: number;
    labor_hours: number = 0;
    part_number: string = "";
    estimated_cost_usd_fron: number = 0;
    estimated_cost_usd_to: number = 0;
}

export class EstimateItem {
    type: string = "";
    item: string = "";
    spec?: string = "";
    description: string = "";
    labor_hours: number = 0;
    details?: string = "";
    estimated_cost_usd_fron: number = 0;
    estimated_cost_usd_to: number = 0;
}
