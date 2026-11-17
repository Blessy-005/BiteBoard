
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { FoodItemService } from '../../data-access/food-item.service';
import { FoodItem } from '../../models/food-item.model';

@Component({
  selector: 'app-food-item-list',
  imports: [RouterLink],
  templateUrl: './food-item-list.html',
  styleUrl: './food-item-list.css',
})
export class FoodItemList implements OnInit {
  private foodItemService = inject(FoodItemService);
  private cdr = inject(ChangeDetectorRef);

  foodItems: FoodItem[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadFoodItems();
  }

  loadFoodItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.foodItemService.getAllFoodItems().subscribe({
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
