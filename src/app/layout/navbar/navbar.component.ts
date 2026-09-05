import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  profileImageUrl: string | null = null;

  ngOnInit(): void {
    this.authService.authenticationState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.authService.getMyProfile().subscribe();
        }
      });

    this.authService.profileImage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profileImageUrl => {
        this.profileImageUrl = profileImageUrl;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get dashboardLink(): string {
    return this.isAdmin ? '/admin/dashboard' : '/dashboard';
  }

  get dashboardLabel(): string {
    return this.isAdmin ? 'Admin Dashboard' : 'User Dashboard';
  }

  logout(): void {
    this.authService.logout();
    this.cdr.markForCheck();
    this.router.navigate(['/']);
  }
}