
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FoodItemService } from '../../data-access/food-item.service';
import { CategoryService } from '../../../categories/data-access/category.service';
import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-add-food-item',
  imports: [ReactiveFormsModule],
  templateUrl: './add-food-item.html',
  styleUrl: './add-food-item.css',
})
export class AddFoodItem implements OnInit {
  private fb = inject(FormBuilder);
  private foodItemService = inject(FoodItemService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  errorMessage = '';

  foodItemForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/.*\S.*/)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    imageUrl: [''],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    isAvailable: [true]
  });

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load categories.';
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

    this.foodItemService.createFoodItem(request).subscribe({
      next: () => {
        alert('Food item created successfully!');
        this.router.navigate(['/food-items']);
      },
      error: (error) => {
        console.error('Food item creation failed:', error);
        this.errorMessage =
          error.error?.message || 'Unable to create food item.';
      }
    });
  }
}
