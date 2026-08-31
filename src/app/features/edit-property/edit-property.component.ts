import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PropertyService } from '../../services/property';
import { Property } from '../../models/property';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-property.component.html',
  styleUrl: './edit-property.component.scss'
})
export class EditPropertyComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly propertyService = inject(PropertyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  propertyId = 0;
  property: Property | null = null;

  readonly maxImages = 7;
  newImages: File[] = [];

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    city: [''],
    address: [''],
    country: [''],
    bedrooms: [0],
    bathrooms: [0],
    rooms: [0],
    area: [0]
  });

  isLoading = false;
  isSaving = false;
  isUploadingImages = false;
  deletingImageId: number | null = null;

  errorMessage = '';
  successMessage = '';
  imageError = '';

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.propertyId) {
      this.errorMessage = 'Invalid property ID.';
      return;
    }

    this.loadProperty();
  }

  loadProperty(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (property) => {
        this.property = property;
        this.form.patchValue({
          title: property.title,
          description: property.description,
          price: property.price,
          city: property.city,
          address: property.address,
          country: property.country,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          rooms: property.rooms,
          area: property.area
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load this property.';
        this.cdr.markForCheck();
      }
    });
  }

  saveDetails(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.propertyService.updateProperty(this.propertyId, this.form.value).subscribe({
      next: (property) => {
        this.property = property;
        this.isSaving = false;
        this.successMessage = 'Property details updated successfully.';
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error?.error?.message ?? 'Unable to update property. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  get currentImageCount(): number {
    return this.property?.images?.length ?? 0;
  }

  onNewImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length === 0) {
      return;
    }

    if (this.currentImageCount + files.length > this.maxImages) {
      this.imageError = `This property can have a maximum of ${this.maxImages} images. It currently has ${this.currentImageCount}.`;
      this.newImages = [];
      input.value = '';
      this.cdr.markForCheck();
      return;
    }

    this.imageError = '';
    this.newImages = files;
  }

  uploadNewImages(): void {
    if (this.newImages.length === 0) {
      return;
    }

    this.isUploadingImages = true;
    this.imageError = '';

    const formData = new FormData();
    this.newImages.forEach((file) => formData.append('images', file));

    this.propertyService.addPropertyImages(this.propertyId, formData).subscribe({
      next: (property) => {
        this.property = property;
        this.newImages = [];
        this.isUploadingImages = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isUploadingImages = false;
        this.imageError = error?.error?.message ?? error?.error ?? 'Unable to upload images.';
        this.cdr.markForCheck();
      }
    });
  }

  deleteImage(imageId: number): void {
    if (this.currentImageCount <= 1) {
      this.imageError = 'A property must have at least one image.';
      return;
    }

    this.deletingImageId = imageId;
    this.imageError = '';

    this.propertyService.deletePropertyImage(this.propertyId, imageId).subscribe({
      next: (property) => {
        this.property = property;
        this.deletingImageId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.deletingImageId = null;
        this.imageError = error?.error?.message ?? error?.error ?? 'Unable to delete this image.';
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/properties']);
  }
}
