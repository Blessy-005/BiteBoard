
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../data-access/category.service';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categoryForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/.*\S.*/)
    ]],
    description: ['']
  });

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const request = {
      name: this.categoryForm.value.name!.trim(),
      description: this.categoryForm.value.description?.trim() || null
    };

    this.categoryService.createCategory(request).subscribe({
      next: (response) => {
        alert('Category created successfully!');
        console.log('Created category:', response);
        this.categoryForm.reset();
      },
      error: (error) => {
        console.error('Category creation failed:', error);
        alert(error.error?.message || 'Something went wrong!');
      }
    });
  }
}
