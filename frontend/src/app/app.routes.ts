
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'categories/add',
    loadComponent: () =>
      import('./features/categories/pages/add-category/add-category')
        .then(m => m.AddCategory)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/category-list/category-list')
        .then(m => m.CategoryList)
  },
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  },
  {
  path: 'categories/edit/:id',
  loadComponent: () =>
    import('./features/categories/pages/edit-category/edit-category')
      .then(m => m.EditCategory)
},
];
