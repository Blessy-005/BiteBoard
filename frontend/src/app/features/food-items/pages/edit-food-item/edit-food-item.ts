
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FoodItemService } from '../../data-access/food-item.service';
import { CategoryService } from '../../../categories/data-access/category.service';
import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-edit-food-item',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-food-item.html',
  styleUrl: './edit-food-item.css',
})
export class EditFoodItem implements OnInit {
  private fb = inject(FormBuilder);
  private foodItemService = inject(FoodItemService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  foodItemId = 0;
  categories: Category[] = [];
  errorMessage = '';

  foodItemForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/.*\S.*/)
    ]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    imageUrl: [''],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    isAvailable: [true]
  });

  ngOnInit(): void {
    this.foodItemId = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadFoodItem();
      },
      error: () => {
        this.errorMessage = 'Unable to load categories.';
        this.cdr.detectChanges();
      }
    });
  }

  loadFoodItem(): void {
    this.foodItemService.getFoodItemById(this.foodItemId).subscribe({
      next: (food) => {
        this.foodItemForm.patchValue({
          name: food.name,
          description: food.description ?? '',
          price: food.price,
          imageUrl: food.imageUrl ?? '',
          categoryId: food.categoryId,
          isAvailable: food.isAvailable
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load food item.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.foodItemForm.invalid) {
      this.foodItemForm.markAllAsTouched();
      return;
    }

    const formValue = this.foodItemForm.getRawValue();

    const request = {
      name: formValue.name!.trim(),
      description: formValue.description?.trim() || null,
      price: formValue.price!,
      imageUrl: formValue.imageUrl?.trim() || null,
      categoryId: formValue.categoryId!,
      isAvailable: formValue.isAvailable!
    };

    this.foodItemService.updateFoodItem(this.foodItemId, request).subscribe({
      next: () => {
        alert('Food item updated successfully!');
        this.router.navigate(['/food-items']);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update food item.';
      }
    });
  }
}
