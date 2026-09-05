import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Return a UrlTree so the router performs the redirect safely.
  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
