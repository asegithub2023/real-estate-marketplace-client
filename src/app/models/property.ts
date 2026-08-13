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
  ownerId: number;
  ownerName: string;
  images?: any[];
  features?: any[];
}
