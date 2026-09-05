import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('🔥 AUTH INTERCEPTOR CALLED');
  console.log('URL:', req.url);
  console.log('HAS TOKEN:', !!token);

  if (!token) {
    return next(req);
  }

  // Clone the immutable request before adding the bearer header.
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('🔥 AUTH HEADER ADDED');

  return next(authReq);
};
