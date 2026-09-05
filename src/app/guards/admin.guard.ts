import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Require both a valid session and the Admin role.
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
