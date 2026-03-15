import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cats',
    pathMatch: 'full',
  },
  {
    path: 'cats',
    loadComponent: () =>
      import('./features/cats/cats-list/cats-list.component').then(
        (m) => m.CatsListComponent
      ),
  },
  {
    path: 'cats/new',
    loadComponent: () =>
      import('./features/cats/cat-form/cat-form.component').then(
        (m) => m.CatFormComponent
      ),
  },
  {
    path: 'cats/:id',
    loadComponent: () =>
      import('./features/cats/cat-detail/cat-detail.component').then(
        (m) => m.CatDetailComponent
      ),
  },
  {
    path: 'cats/:id/edit',
    loadComponent: () =>
      import('./features/cats/cat-form/cat-form.component').then(
        (m) => m.CatFormComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'cats',
  },
];
