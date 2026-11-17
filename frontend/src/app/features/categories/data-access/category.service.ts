
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(
      `${environment.apiUrl}/categories`,
      request
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${environment.apiUrl}/categories`
    );
  }

  updateCategory(
    id: number,
    request: UpdateCategoryRequest
  ): Observable<Category> {
    return this.http.put<Category>(
      `${environment.apiUrl}/categories/${id}`,
      request
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/categories/${id}`
    );
  }
}
