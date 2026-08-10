import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PropertyService } from '../../services/property';
import { CreatePropertyRequest } from '../../models/create-property-request';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-property.html',
  styleUrls: ['./create-property.scss']
})
export class CreatePropertyComponent {
  form!: FormGroup;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly propertyService: PropertyService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      address: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: CreatePropertyRequest = this.form.value as CreatePropertyRequest;
    // try to use currently logged-in user id from localStorage (set after login),
    // fall back to 1 for local/dev testing
    const storedUserId = localStorage.getItem('userId');
    payload.ownerId = storedUserId ? parseInt(storedUserId, 10) : 1;

    this.propertyService.createProperty(payload).subscribe({
      next: () => {
        this.successMessage = 'Property created successfully.';
        this.form.reset({ title: '', description: '', price: 0, address: '' });
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Unable to create property. Check the API and try again.';
        this.isSubmitting = false;
      }
    });
  }
}