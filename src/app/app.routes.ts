
import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(
        (m) => m.HomeComponent
      )
  },

  {
    path: 'properties/create',
    loadComponent: () =>
      import('./features/create-property/create-property').then(
        (m) => m.CreatePropertyComponent
      )
  },
//
  //{
    //path: 'properties',
    //loadComponent: () =>
     // import('./features/property-list/property-list').then(
        //(m) => m.PropertyListComponent
     // )
  //},
//
  {
    path: '**',
    component: NotFoundComponent
  }
];