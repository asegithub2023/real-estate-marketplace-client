import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PropertyService } from '../../services/property';
import { Property } from '../../models/property';
import { PagedRequest } from '../../models/paged-request';
import { getListingTypeLabel } from '../../shared/utils/property-status';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);
  private readonly cdr = inject(ChangeDetectorRef);

  featuredProperties: Property[] = [];

  loading = false;

  readonly getListingTypeLabel = getListingTypeLabel;

  ngOnInit(): void {
    this.loadFeaturedProperties();
  }

  private loadFeaturedProperties(): void {
    this.loading = true;

    const request: PagedRequest = {
      page: 1,
      pageSize: 3,
      orderBy: 'id',
      descending: true
    };

    this.propertyService.getProperties(request).subscribe({
      next: (response) => {
        const pagedResponse = response as any;
        const items = Array.isArray(pagedResponse.items)
          ? pagedResponse.items
          : Array.isArray(pagedResponse.data)
            ? pagedResponse.data
            : [];

        this.featuredProperties = items as Property[];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
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