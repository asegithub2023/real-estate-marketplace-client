
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
  path: 'dashboard',
  loadComponent: () =>
    import('./features/user/user-dashboard/user-dashboard.component')
      .then(m => m.UserDashboardComponent)
},

{
  path: 'dashboard/profile',
  loadComponent: () =>
    import('./features/user/profile/profile.component')
      .then(m => m.ProfileComponent)
},

{
  path: 'dashboard/properties',
  loadComponent: () =>
    import('./features/user/my-properties/my-properties.component')
      .then(m => m.MyPropertiesComponent)
},

{
  path: 'dashboard/favorites',
  loadComponent: () =>
    import('./features/user/favorites/favorites.component')
      .then(m => m.FavoritesComponent)
},

{
  path: 'dashboard/notifications',
  loadComponent: () =>
    import('./features/user/notifications/notifications.component')
      .then(m => m.NotificationsComponent)
},

{
  path: 'dashboard/messages',
  loadComponent: () =>
    import('./features/user/messages/messages.component')
      .then(m => m.MessagesComponent)
},

{
  path: 'properties/:id/reviews',
  loadComponent: () =>
    import('./features/reviews/property-reviews/property-reviews.component')
      .then(m => m.PropertyReviewsComponent)
},

{
  path: 'admin',
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./features/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
    },
    {
      path: 'users',
      loadComponent: () =>
        import('./features/admin/users/users.component')
          .then(m => m.UsersComponent)
    },
    {
      path: 'properties',
      loadComponent: () =>
        import('./features/admin/properties/properties.component')
          .then(m => m.PropertiesComponent)
    },
    {
      path: 'reports',
      loadComponent: () =>
        import('./features/admin/reports/reports.component')
          .then(m => m.ReportsComponent)
    }
  ]
},
  {
    path: '**',
    component: NotFoundComponent
  }

];