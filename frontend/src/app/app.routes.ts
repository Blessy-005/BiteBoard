import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // Authentication routes
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register')
        .then(m => m.Register)
  },

  // Dashboard - Admin and Staff only
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Staff'] },
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  // Category routes
  {
    path: 'categories/add',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./features/categories/pages/add-category/add-category')
        .then(m => m.AddCategory)
  },
  {
    path: 'categories/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Staff'] },
    loadComponent: () =>
      import('./features/categories/pages/edit-category/edit-category')
        .then(m => m.EditCategory)
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-list/category-list')
        .then(m => m.CategoryList)
  },

  // Food item routes
  {
    path: 'food-items/add',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./features/food-items/pages/add-food-item/add-food-item')
        .then(m => m.AddFoodItem)
  },
  {
    path: 'food-items/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Staff'] },
    loadComponent: () =>
      import('./features/food-items/pages/edit-food-item/edit-food-item')
        .then(m => m.EditFoodItem)
  },
  {
    path: 'food-items',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/food-items/pages/food-item-list/food-item-list')
        .then(m => m.FoodItemList)
  },

  // Default route
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
