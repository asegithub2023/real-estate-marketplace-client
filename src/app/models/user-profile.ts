export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  role: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
}
