export interface PagedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}
