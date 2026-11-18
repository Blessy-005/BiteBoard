import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CategoryService } from '../../data-access/category.service';
import { Category } from '../../models/category.model';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  authService = inject(AuthService);

  categories: Category[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.errorMessage = 'Unable to load categories.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCategory(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this category?');

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        alert('Category deleted successfully!');
        this.loadCategories();
      },
      error: (error) => {
        console.error('Category deletion failed:', error);
        alert(error.error?.message || 'Unable to delete category.');
      }
    });
  }
}
