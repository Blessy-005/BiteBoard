
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  FoodItem,
  CreateFoodItemRequest,
  UpdateFoodItemRequest
} from '../models/food-item.model';

@Injectable({
  providedIn: 'root',
})
export class FoodItemService {
  private http = inject(HttpClient);

  createFoodItem(request: CreateFoodItemRequest): Observable<FoodItem> {
    return this.http.post<FoodItem>(
      `${environment.apiUrl}/fooditems`,
      request
    );
  }

  getAllFoodItems(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(
      `${environment.apiUrl}/fooditems`
    );
  }

  getFoodItemById(id: number): Observable<FoodItem> {
    return this.http.get<FoodItem>(
      `${environment.apiUrl}/fooditems/${id}`
    );
  }

  updateFoodItem(
    id: number,
    request: UpdateFoodItemRequest
  ): Observable<FoodItem> {
    return this.http.put<FoodItem>(
      `${environment.apiUrl}/fooditems/${id}`,
      request
    );
  }

  deleteFoodItem(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/fooditems/${id}`
    );
  }
}
