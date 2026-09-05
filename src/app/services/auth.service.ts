import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { AuthResponse } from '../models/auth-response';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';
import { UserSummary } from '../models/user-summary';
import { UserProfile, UpdateProfileRequest } from '../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly tokenKey = 'access_token';
  private readonly userIdKey = 'userId';
  private readonly roleKey = 'role';

  private readonly authenticationStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  readonly authenticationState$ = this.authenticationStateSubject.asObservable();
  private readonly profileImageSubject = new BehaviorSubject<string | null>(null);
  readonly profileImage$ = this.profileImageSubject.asObservable();

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.persistSession(response))
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => this.persistSession(response))
      );
  }

  forgotPassword(
  request: ForgotPasswordRequest
): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/forgot-password`,
    request
  );
}

resetPassword(
  request: ResetPasswordRequest
): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/reset-password`,
    request
  );
}

  /** Admin-only: list every registered user. */
  getAllUsers(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${this.apiUrl}/users`);
  }

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(
      tap(profile => this.profileImageSubject.next(profile.profileImageUrl ?? null))
    );
  }

  updateMyProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, request).pipe(
      tap(profile => this.profileImageSubject.next(profile.profileImageUrl ?? null))
    );
  }

  uploadMyProfilePhoto(photo: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post<UserProfile>(`${this.apiUrl}/me/photo`, formData).pipe(
      tap(profile => this.profileImageSubject.next(profile.profileImageUrl ?? null))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.roleKey);
    this.profileImageSubject.next(null);
    this.authenticationStateSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem(this.userIdKey);
    return id ? parseInt(id, 10) : null;
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'Admin';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userIdKey, response.userId.toString());
    localStorage.setItem(this.roleKey, response.role);
    this.authenticationStateSubject.next(true);
  }
}