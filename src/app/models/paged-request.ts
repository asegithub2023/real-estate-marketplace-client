export interface PagedRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  descending?: boolean;
}
