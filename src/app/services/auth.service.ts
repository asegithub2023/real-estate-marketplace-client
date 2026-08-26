import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { AuthResponse } from '../models/auth-response';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly tokenKey = 'access_token';
  private readonly userIdKey = 'userId';
  private readonly roleKey = 'role';

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
  localStorage.setItem(this.tokenKey, response.token);
  localStorage.setItem(this.userIdKey, response.userId.toString());
  localStorage.setItem(this.roleKey, response.role);
})
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => {
  localStorage.setItem(this.tokenKey, response.token);
  localStorage.setItem(this.userIdKey, response.userId.toString());
  localStorage.setItem(this.roleKey, response.role);
})
      );
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/forgot-password`,
      request
    );
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/reset-password`,
      request
    );
  }

  logout(): void {
  localStorage.removeItem(this.tokenKey);
  localStorage.removeItem(this.userIdKey);
  localStorage.removeItem(this.roleKey);
}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem(this.userIdKey);
    return id ? parseInt(id, 10) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
getRole(): string | null {
  return localStorage.getItem(this.roleKey);
}

}