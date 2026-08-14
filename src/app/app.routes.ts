
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

{
  path: 'properties',
  loadComponent: () =>
    import('./features/property-list/property-list.component')
      .then(m => m.PropertyListComponent)
},

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

{
  path: 'register',
  loadComponent: () =>
    import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent)
},

{
  path: 'forgot-password',
  loadComponent: () =>
    import('./features/auth/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
},


{
  path: 'reset-password',
  loadComponent: () =>
    import('./features/auth/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent)
},

  {
    path: '**',
    component: NotFoundComponent
  }

];