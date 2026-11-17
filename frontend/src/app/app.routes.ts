
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Category routes
  {
    path: 'categories/add',
    loadComponent: () =>
      import('./features/categories/pages/add-category/add-category')
        .then(m => m.AddCategory)
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () =>
      import('./features/categories/pages/edit-category/edit-category')
        .then(m => m.EditCategory)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/category-list/category-list')
        .then(m => m.CategoryList)
  },

  // Food item routes
  {
    path: 'food-items/add',
    loadComponent: () =>
      import('./features/food-items/pages/add-food-item/add-food-item')
        .then(m => m.AddFoodItem)
  },
  {
    path: 'food-items/edit/:id',
    loadComponent: () =>
      import('./features/food-items/pages/edit-food-item/edit-food-item')
        .then(m => m.EditFoodItem)
  },
  {
    path: 'food-items',
    loadComponent: () =>
      import('./features/food-items/pages/food-item-list/food-item-list')
        .then(m => m.FoodItemList)
  },

  // Default route
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  }
];
