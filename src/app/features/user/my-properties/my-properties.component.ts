import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PropertyService } from '../../../services/property';
import { AuthService } from '../../../services/auth.service';
import { Property } from '../../../models/property';
import {
  getPropertyStatusLabel,
  getListingTypeLabel,
  getPropertyTypeLabel
} from '../../../shared/utils/property-status';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.scss'
})
export class MyPropertiesComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Values match RealEstateMarketplace.Domain.Enums.PropertyStatus.
  // Owners are only allowed to move between these three states themselves;
  // Draft/PendingApproval/Approved/Rejected are managed elsewhere (e.g. admin review).
  readonly ownerStatusOptions = [
    { value: 4, label: 'Available' },
    { value: 5, label: 'Sold' },
    { value: 6, label: 'Rented' }
  ];

  properties: Property[] = [];

  isLoading = false;
  errorMessage = '';

  // Id of the property whose status update is currently in flight, if any.
  updatingPropertyId: number | null = null;

  // Id of the property currently showing the "are you sure?" confirmation.
  confirmingDeleteId: number | null = null;
  deletingPropertyId: number | null = null;

  readonly getPropertyStatusLabel = getPropertyStatusLabel;
  readonly getListingTypeLabel = getListingTypeLabel;
  readonly getPropertyTypeLabel = getPropertyTypeLabel;

  ngOnInit(): void {
    this.loadProperties();
  }

  onStatusChange(property: Property, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = Number(select.value);

    if (Number(property.status) === newStatus) {
      return;
    }

    this.updatingPropertyId = property.id;
    this.errorMessage = '';

    this.propertyService.updatePropertyStatus(property.id, newStatus).subscribe({
      next: () => {
        property.status = newStatus.toString();
        this.updatingPropertyId = null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to update property status. Please try again.';
        this.updatingPropertyId = null;
        this.cdr.markForCheck();
      }
    });
  }

  askDeleteConfirmation(propertyId: number): void {
    this.confirmingDeleteId = propertyId;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(propertyId: number): void {
    this.deletingPropertyId = propertyId;
    this.errorMessage = '';

    this.propertyService.deleteProperty(propertyId).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== propertyId);
        this.confirmingDeleteId = null;
        this.deletingPropertyId = null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to delete this property. Please try again.';
        this.confirmingDeleteId = null;
        this.deletingPropertyId = null;
        this.cdr.markForCheck();
      }
    });
  }

  private loadProperties(): void {
    const ownerId = this.authService.getCurrentUserId();

    if (!ownerId) {
      this.errorMessage = 'You must be logged in to view your properties.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.propertyService.getPropertiesByOwner(ownerId).subscribe({
      next: (properties) => {
        this.properties = properties;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load your properties.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}