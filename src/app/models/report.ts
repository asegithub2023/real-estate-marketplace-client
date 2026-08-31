export interface Report {
  id: number;
  reason: string;
  status: number;
  createdAt: string;
  userId: number;
  reporterName: string;
  propertyId: number;
  propertyTitle: string;
}

// Matches RealEstateMarketplace.Domain.Enums.ReportStatus
export const ReportStatus = {
  Pending: 0,
  Reviewed: 1,
  Dismissed: 2
} as const;