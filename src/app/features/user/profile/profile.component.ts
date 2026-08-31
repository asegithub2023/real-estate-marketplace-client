import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../models/user-profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  profile: UserProfile = {
    id: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    profileImageUrl: '',
    role: ''
  };

  isEditing = false;
  isLoading = false;
  isSaving = false;
  isUploadingPhoto = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load your profile.';
        this.cdr.markForCheck();
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.loadProfile();
  }

  saveProfile(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateMyProfile({
      fullName: this.profile.fullName,
      email: this.profile.email,
      phoneNumber: this.profile.phoneNumber
    }).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isSaving = false;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully.';
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error?.error?.message ?? 'Unable to update profile. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.isUploadingPhoto = true;
    this.errorMessage = '';

    this.authService.uploadMyProfilePhoto(file).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isUploadingPhoto = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isUploadingPhoto = false;
        this.errorMessage = 'Unable to upload photo. Please try a JPEG, PNG, or WebP image.';
        this.cdr.markForCheck();
      }
    });

    input.value = '';
  }
}