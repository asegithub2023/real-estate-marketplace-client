import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ToastComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  errorMessage = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({

        next: () => {
  this.loading = false;
  this.showToast('Login successful! Redirecting...', 'success');

  const destination = this.authService.isAdmin()
    ? '/admin/dashboard'
    : '/dashboard';

  setTimeout(() => {
    this.router.navigate([destination]);
  }, 800);
},

        error: (error) => {
          this.loading = false;

          this.errorMessage =
            error?.error?.message ??
            'Invalid email or password. Please try again.';

          this.cdr.markForCheck();
        }

      });
  }

  private showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.markForCheck();
    }, 3000);
  }
}
