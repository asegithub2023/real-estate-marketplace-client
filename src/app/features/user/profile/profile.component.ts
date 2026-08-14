import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profile: UserProfile = {
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  isEditing = false;

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    // API integration will be added when the user profile endpoint is connected.
    this.isEditing = false;
  }
}