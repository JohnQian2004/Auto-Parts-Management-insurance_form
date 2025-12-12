import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../services/categories.service';

@Component({
  selector: 'app-travel-category',
  templateUrl: './travel-category.component.html',
  styleUrls: ['./travel-category.component.css']
})
export class TravelCategoryComponent {
  @Input() category!: Category;
  @Input() selectedCategory: string = '';
  @Input() tripsCount: number = 0;

  isSelected(): boolean {
    return (this.category.name === 'All Categories' && this.selectedCategory === '') || 
           this.selectedCategory === this.category.name;
  }
} 