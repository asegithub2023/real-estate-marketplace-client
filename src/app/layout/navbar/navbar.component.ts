import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

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