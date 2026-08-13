import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PropertyService } from '../../services/property';
import { Property } from '../../models/property';
import { PagedRequest } from '../../models/paged-request';
import { PagedResponse } from '../../models/paged-response';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})
export class PropertyListComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);

  properties: Property[] = [];

  search = '';
  page = 1;
  pageSize = 6;

  totalCount = 0;
  totalPages = 0;

  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.error = '';

    const request: PagedRequest = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.search || undefined,
      orderBy: 'id',
      descending: true
    };

    this.propertyService.getProperties(request).subscribe({
      next: (response: PagedResponse<Property>) => {
        this.properties = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.page = response.page;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load properties. Please try again.';
      }
    });
  }

  searchProperties(): void {
    this.page = 1;
    this.loadProperties();
  }

  clearSearch(): void {
    this.search = '';
    this.page = 1;
    this.loadProperties();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) {
      return;
    }

    this.page = page;
    this.loadProperties();
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );
  }

  getPropertyImage(property: Property): string {
    if (property.images && property.images.length > 0) {
      const image = property.images[0];

      if (typeof image === 'string') {
        return image;
      }

      return image.imageUrl ?? 'assets/images/property-placeholder.jpg';
    }

    return 'assets/images/property-placeholder.jpg';
  }
}
