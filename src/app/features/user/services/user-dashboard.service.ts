import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

import { FavoriteService } from '../../../services/favorite.service';

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

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      favorites: this.favoriteService.getFavorites()
    }).pipe(
      map(({ favorites }) => ({
        totalProperties: 0,
        activeProperties: 0,
        favorites: favorites.length,
        unreadNotifications: 0
      }))
    );
  }
}