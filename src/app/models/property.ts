export interface PropertyImage {
  id: number;
  imageUrl: string;
  propertyId: number;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  area: number;
  status: string;
  propertyType: string;
  listingType: string;
  ownerId: number;
  ownerName: string;
  images?: PropertyImage[];
  features?: any[];
}

export interface ApiResponse<T> {
  data: T;
  links: any[];
}

export interface UpdatePropertyRequest {
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  area: number;
}