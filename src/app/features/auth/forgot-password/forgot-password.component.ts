import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = false;
  submitted = false;
  errorMessage = '';

  forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email } = this.forgotPasswordForm.getRawValue();

    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ??
          'Unable to process your request. Please try again.';
      }
    });
  }
}
