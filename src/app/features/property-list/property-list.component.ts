import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property';
import { Property } from '../../models/property';
import { PagedRequest } from '../../models/paged-request';
import { PagedResponse } from '../../models/paged-response';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { getListingTypeLabel } from '../../shared/utils/property-status';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingComponent,
    ToastComponent,
    RouterLink
  ],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})
export class PropertyListComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly favoriteService = inject(FavoriteService);

  properties: Property[] = [];

  readonly getListingTypeLabel = getListingTypeLabel;

  search = '';
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  city = '';
  sortBy = 'newest';

  page = 1;
  pageSize = 6;

  totalCount = 0;
  totalPages = 0;

  loading = false;
  error = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    this.loadProperties();

    this.favoriteService.favoriteIds$.subscribe(() =>
      this.cdr.markForCheck()
    );

    this.favoriteService.loadFavoriteIds();
  }

  isFavorite(propertyId: number): boolean {
    return this.favoriteService.currentFavoriteIds.has(propertyId);
  }

  toggleFavorite(property: Property, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.favoriteService.toggleFavorite(property.id).subscribe({
      next: (isFavorited) => {
        this.showToast(
          isFavorited ? 'Added to favorites' : 'Removed from favorites',
          'success'
        );
        this.cdr.markForCheck();
      },
      error: () => {
        this.showToast('Please log in to save favorites', 'error');
        this.cdr.markForCheck();
      }
    });
  }

    showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  loadProperties(): void {
    this.loading = true;
    this.error = '';

    const request: PagedRequest = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.search || undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minBedrooms: this.minBedrooms,
      minBathrooms: this.minBathrooms,
      city: this.city || undefined,
      sortBy: this.sortBy
    };

    this.propertyService.getProperties(request).subscribe({
      next: (response: PagedResponse<Property>) => {
        this.properties = response.data;
        this.totalCount = response.meta.totalCount;
        this.totalPages = response.meta.totalPages;
        this.page = response.meta.page;

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.loading = false;
        this.error = 'Unable to load properties. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  searchProperties(): void {
    this.page = 1;
    this.loadProperties();
  }

  clearFilters(): void {
    this.search = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.minBedrooms = undefined;
    this.minBathrooms = undefined;
    this.city = '';
    this.sortBy = 'newest';
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