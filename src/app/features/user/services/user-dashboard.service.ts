import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';

import { FavoriteService } from '../../../services/favorite.service';
import { PropertyService } from '../../../services/property';
import { AuthService } from '../../../services/auth.service';

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  favorites: number;
  unreadNotifications: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  private readonly favoriteService = inject(FavoriteService);
  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);

  getDashboardStats(): Observable<DashboardStats> {
    const userId = this.authService.getCurrentUserId();

    // Load independent dashboard totals in parallel.
    return forkJoin({
      favorites: this.favoriteService.getFavorites(),
      properties: userId
        ? this.propertyService.getPropertiesByOwner(userId)
        : of([])
    }).pipe(
      map(({ favorites, properties }) => ({
        totalProperties: properties.length,

        activeProperties: properties.filter(p => Number(p.status) !== 0).length,
        favorites: favorites.length,
        unreadNotifications: 0
      }))
    );
  }
}
