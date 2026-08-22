export interface Favorite {
  id: number;
  userId: number;
  propertyId: number;
  propertyTitle: string;
  propertyPrice: number;
  propertyCity: string;
  propertyCountry: string;
  propertyBedrooms: number;
  propertyBathrooms: number;
  propertyArea: number;
  propertyImageUrl?: string;
}