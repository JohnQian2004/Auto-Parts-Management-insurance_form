import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.css']
})
export class BottomMenuComponent {
  @Input() bottomMenuSetting: any[] = [];  // Accept bottom menu settings as an input
  @Input() menuTextColor: string = 'text-white'; // Accept the default text color
  @Input() menuTextColorActive: string = 'text-warning'; // Accept the active tab text color
  @Input() showNotification: boolean = false; // Flag to control notification visibility

  @Output() tabSelected = new EventEmitter<{ selectedTab: number, sectionId: number, sectionTooltip: string }>(); // Emit selected tab data to parent

  selectedTab: number = 0;  // Default tab selection

  // Handle tab change and emit event with selectedTab, sectionId, and sectionTooltip
  onTabChange(i: number) {
    this.selectedTab = i;
    const { selectedTab, sectionId, sectionTooltip } = this.bottomMenuSetting[i];
    this.tabSelected.emit({ selectedTab, sectionId, sectionTooltip }); // Emit data to parent
  }

  getTabLabel(i: number): string {
    return this.bottomMenuSetting[i]?.label || ''; // Return label for the tab
  }

  getTabTooltip(i: number): string {
    return this.bottomMenuSetting[i]?.tooltip || ''; // Return tooltip for the tab
  }

  getTabNotification(i: number): number {
    return this.bottomMenuSetting[i]?.notification || 0; // Return notification count for the tab
  }

  // Return dynamic classes for label based on selectedTab
  getLabelClass(i: number): string {
    return this.selectedTab === i ? this.menuTextColorActive : this.menuTextColor;
  }
}
