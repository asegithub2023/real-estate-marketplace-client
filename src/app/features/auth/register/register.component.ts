import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ToastComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  errorMessage = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  registerForm = this.fb.nonNullable.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    phoneNumber: [
      '',
      [
        Validators.required
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

    confirmPassword: [
      '',
      [
        Validators.required
      ]
    ]
  });

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword
    } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      fullName,
      email,
      phoneNumber,
      password
    })
    .subscribe({

      next: () => {
        this.loading = false;
        this.showToast('Account created successfully! Redirecting...', 'success');

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 800);
      },

      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ??
          'Registration failed. Please try again.';

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
