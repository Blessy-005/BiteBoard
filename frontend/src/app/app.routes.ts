
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'categories/add',
    loadComponent: () =>
      import('./features/categories/pages/add-category/add-category')
        .then(m => m.AddCategory)
  }
];
