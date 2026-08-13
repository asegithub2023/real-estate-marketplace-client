import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PropertyService } from '../../services/property';
import { Property } from '../../models/property';
import { PagedRequest } from '../../models/paged-request';

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

  featuredProperties: Property[] = [];

  loading = false;

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
        this.featuredProperties = response.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
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