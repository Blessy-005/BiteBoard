import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Category, CreateCategoryRequest } from '../models/category.model';

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
}