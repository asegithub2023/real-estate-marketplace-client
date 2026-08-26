// The API returns PropertyStatus as its raw numeric enum value (no
// JsonStringEnumConverter is configured server-side), so the frontend has to
// map it to a label itself. Order must match RealEstateMarketplace.Domain.Enums.PropertyStatus.
const STATUS_LABELS = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Available',
  'Sold',
  'Rented'
];

export function getPropertyStatusLabel(status: number | string): string {
  const index = Number(status);
  return STATUS_LABELS[index] ?? 'Unknown';
}

export type PropertyStatusVariant = 'success' | 'warning' | 'danger';

export function getPropertyStatusVariant(status: number | string): PropertyStatusVariant {
  const index = Number(status);

  if (index === 3) {
    return 'danger'; // Rejected
  }

  if (index === 0 || index === 1) {
    return 'warning'; // Draft, Pending Approval
  }

  return 'success'; // Approved, Available, Sold, Rented
}