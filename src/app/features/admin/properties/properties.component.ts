import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PropertyService } from '../../../services/property';
import {
  getPropertyStatusLabel,
  getPropertyStatusVariant,
  PropertyStatusVariant
} from '../../../shared/utils/property-status';

interface AdminProperty {
  id: number;
  title: string;
  owner: string;
  location: string;
  price: string;
  status: string;
  variant: PropertyStatusVariant;

  needsReview: boolean;
}

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);
  private readonly cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  properties: AdminProperty[] = [];

  ngOnInit(): void {
    this.isLoading = true;

    this.propertyService.getAllProperties().subscribe({
      next: (properties) => {
        this.properties = properties.map(p => ({
          id: p.id,
          title: p.title,
          owner: p.ownerName,
          location: p.city,
          price: `$${p.price.toLocaleString()}`,
          status: getPropertyStatusLabel(p.status),
          variant: getPropertyStatusVariant(p.status),
          needsReview: Number(p.status) === 0 || Number(p.status) === 1
        }));

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load properties.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get filteredProperties(): AdminProperty[] {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      return this.properties;
    }

    return this.properties.filter(property =>
      property.title.toLowerCase().includes(search) ||
      property.owner.toLowerCase().includes(search) ||
      property.location.toLowerCase().includes(search)
    );
  }

  approve(property: AdminProperty): void {
    this.updateStatus(property, 2, 'Approved', 'success');
  }

  reject(property: AdminProperty): void {
    this.updateStatus(property, 3, 'Rejected', 'danger');
  }

  private updateStatus(
    property: AdminProperty,
    statusValue: number,
    label: string,
    variant: PropertyStatusVariant
  ): void {
    this.propertyService.updatePropertyStatus(property.id, statusValue).subscribe({
      next: () => {
        property.status = label;
        property.variant = variant;
        property.needsReview = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = `Unable to update "${property.title}".`;
        this.cdr.markForCheck();
      }
    });
  }
}
