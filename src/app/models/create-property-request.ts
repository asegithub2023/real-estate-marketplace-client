export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
  address: string;
  ownerId?: number;
}