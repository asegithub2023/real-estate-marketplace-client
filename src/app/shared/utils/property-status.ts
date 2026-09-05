const STATUS_LABELS = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Available',
  'Sold',
  'Rented'
];

// Keep this order aligned with the API enum values.
export function getPropertyStatusLabel(status: number | string): string {
  const index = Number(status);
  return STATUS_LABELS[index] ?? 'Unknown';
}

export type PropertyStatusVariant = 'success' | 'warning' | 'danger';

export function getPropertyStatusVariant(status: number | string): PropertyStatusVariant {
  const index = Number(status);

  if (index === 3) {
    return 'danger';
  }

  if (index === 0 || index === 1) {
    return 'warning';
  }

  return 'success';
}

const LISTING_TYPE_LABELS = ['Sale', 'Rent', 'Short Stay'];

export function getListingTypeLabel(listingType: number | string): string {
  const index = Number(listingType);
  return LISTING_TYPE_LABELS[index] ?? 'Unknown';
}

const PROPERTY_TYPE_LABELS = [
  'House',
  'Apartment',
  'Villa',
  'Condominium',
  'Office',
  'Shop',
  'Warehouse',
  'Land'
];

export function getPropertyTypeLabel(propertyType: number | string): string {
  const index = Number(propertyType);
  return PROPERTY_TYPE_LABELS[index] ?? 'Unknown';
}
