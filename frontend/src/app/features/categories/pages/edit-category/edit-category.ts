
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoryService } from '../../data-access/category.service';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryId = 0;
  errorMessage = '';

  categoryForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/.*\S.*/)
    ]],
    description: ['']
  });

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        const category = categories.find(c => c.id === this.categoryId);

        if (!category) {
          this.errorMessage = 'Category not found.';
          return;
        }

        this.categoryForm.patchValue({
          name: category.name,
          description: category.description ?? ''
        });
      },
      error: () => {
        this.errorMessage = 'Unable to load category.';
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const request = {
      name: this.categoryForm.value.name!.trim(),
      description: this.categoryForm.value.description?.trim() || null
    };

    this.categoryService.updateCategory(this.categoryId, request).subscribe({
      next: () => {
        alert('Category updated successfully!');
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update category.';
      }
    });
  }
}
