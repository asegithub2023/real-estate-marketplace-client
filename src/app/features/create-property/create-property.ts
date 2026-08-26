import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { PropertyService } from '../../services/property';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-property.html',
  styleUrls: ['./create-property.scss']
})
export class CreatePropertyComponent {

  form!: FormGroup;

  selectedImages: File[] = [];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly propertyService: PropertyService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      city: [''],
      address: [''],
      country: [''],
      bedrooms: [0],
      bathrooms: [0],
      rooms: [0],
      area: [0],
      status: [0]
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    this.selectedImages = Array.from(input.files);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.selectedImages.length === 0) {
      this.errorMessage = 'At least one image is required.';
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();

    formData.append('Title', this.form.value.title);
    formData.append('Description', this.form.value.description);
    formData.append('Price', this.form.value.price.toString());
    formData.append('City', this.form.value.city || '');
    formData.append('Address', this.form.value.address || '');
    formData.append('Country', this.form.value.country || '');
    formData.append('Bedrooms', this.form.value.bedrooms.toString());
    formData.append('Bathrooms', this.form.value.bathrooms.toString());
    formData.append('Rooms', this.form.value.rooms.toString());
    formData.append('Area', this.form.value.area.toString());
    formData.append('Status', this.form.value.status.toString());

    const storedUserId = localStorage.getItem('userId');
    const ownerId = storedUserId ? parseInt(storedUserId, 10) : 1;

    formData.append('OwnerId', ownerId.toString());

    this.selectedImages.forEach((image) => {
      formData.append('Images', image);
    });

    this.propertyService.createProperty(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Property created successfully!';
        this.cdr.markForCheck();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (error) => {
        console.error('Create property error:', error);

        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ||
          'Unable to create property. Please try again.';

        this.cdr.markForCheck();
      }
    });
  }
}