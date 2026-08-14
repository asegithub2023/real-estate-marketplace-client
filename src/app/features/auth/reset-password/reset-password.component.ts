import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = false;
  submitted = false;
  errorMessage = '';

  private readonly token =
    this.route.snapshot.queryParamMap.get('token') ?? '';

  private readonly email =
    this.route.snapshot.queryParamMap.get('email') ?? '';

  resetPasswordForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: passwordsMatch
    }
  );

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.token || !this.email) {
      this.errorMessage =
        'The password reset link is invalid or incomplete.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { password } = this.resetPasswordForm.getRawValue();

    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ??
          'Unable to reset your password. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}