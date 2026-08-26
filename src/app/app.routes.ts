
import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

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
    canActivate: [authGuard],
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
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/user/user-dashboard/user-dashboard.component')
      .then(m => m.UserDashboardComponent)
},

{
  path: 'dashboard/profile',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/user/profile/profile.component')
      .then(m => m.ProfileComponent)
},

{
  path: 'dashboard/properties',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/user/my-properties/my-properties.component')
      .then(m => m.MyPropertiesComponent)
},

{
  path: 'dashboard/favorites',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/user/favorites/favorites.component')
      .then(m => m.FavoritesComponent)
},

{
  path: 'dashboard/notifications',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/user/notifications/notifications.component')
      .then(m => m.NotificationsComponent)
},

{
  path: 'dashboard/messages',
  canActivate: [authGuard],
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
  canActivate: [adminGuard],
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
  path: 'properties/:id',
  loadComponent: () =>
    import('./features/property-details/property-details.component')
      .then(m => m.PropertyDetailsComponent)
},


  {
    path: '**',
    component: NotFoundComponent
  }

];