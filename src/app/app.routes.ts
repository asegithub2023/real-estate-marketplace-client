import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'properties/create',
    pathMatch: 'full'
  },
  {
    path: 'properties/create',
    loadComponent: () =>
      import('./features/create-property/create-property').then(
        (m) => m.CreatePropertyComponent
      )
  }
];