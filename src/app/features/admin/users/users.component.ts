import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { UserSummary } from '../../../models/user-summary';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  users: UserSummary[] = [];

  ngOnInit(): void {
    this.isLoading = true;

    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load users.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get filteredUsers(): UserSummary[] {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      return this.users;
    }

    return this.users.filter(user =>
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }
}