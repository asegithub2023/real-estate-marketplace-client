export interface PagedRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  descending?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  city?: string;
  propertyType?: number;
  listingType?: number;
  sortBy?: string;
}