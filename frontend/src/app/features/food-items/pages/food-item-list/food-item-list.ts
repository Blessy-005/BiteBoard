
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { FoodItemService } from '../../data-access/food-item.service';
import { FoodItem } from '../../models/food-item.model';
import { CategoryService } from '../../../categories/data-access/category.service';
import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-food-item-list',
  imports: [RouterLink],
  templateUrl: './food-item-list.html',
  styleUrl: './food-item-list.css',
})
export class FoodItemList implements OnInit {
  private foodItemService = inject(FoodItemService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  foodItems: FoodItem[] = [];
  categories: Category[] = [];

  searchText = '';
  selectedCategoryId = 0;

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
    this.loadFoodItems();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  loadFoodItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const categoryId = this.selectedCategoryId || undefined;

    this.foodItemService
      .getAllFoodItems(this.searchText, categoryId)
      .subscribe({
        next: (response) => {
          this.foodItems = response;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load food items:', error);
          this.errorMessage = 'Unable to load food items.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.loadFoodItems();
  }

  onCategoryChange(value: string): void {
    this.selectedCategoryId = Number(value);
    this.loadFoodItems();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategoryId = 0;
    this.loadFoodItems();
  }

  deleteFoodItem(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this food item?'
    );

    if (!confirmed) {
      return;
    }

    this.foodItemService.deleteFoodItem(id).subscribe({
      next: () => {
        alert('Food item deleted successfully!');
        this.loadFoodItems();
      },
      error: (error) => {
        console.error('Food item deletion failed:', error);
        alert(error.error?.message || 'Unable to delete food item.');
      }
    });
  }
}
