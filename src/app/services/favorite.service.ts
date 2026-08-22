import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Favorite } from '../models/favorite';
import { ApiResponse } from '../models/property';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/favorites`;

  private readonly favoriteIdsSubject = new BehaviorSubject<Set<number>>(new Set());
  favoriteIds$ = this.favoriteIdsSubject.asObservable();

  get currentFavoriteIds(): Set<number> {
    return this.favoriteIdsSubject.value;
  }


  loadFavoriteIds(): void {
  this.http.get<ApiResponse<Favorite>[]>(`${this.apiUrl}/me`).subscribe({
    next: (response) => {
      const ids = new Set(response.map(r => r.data.propertyId));
      this.favoriteIdsSubject.next(ids);
    }
  });
}

getFavorites(): Observable<Favorite[]> {
  return this.http
    .get<ApiResponse<Favorite>[]>(`${this.apiUrl}/me`)
    .pipe(map(response => response.map(r => r.data)));
}


  toggleFavorite(propertyId: number): Observable<boolean> {
    const isFavorited = this.favoriteIdsSubject.value.has(propertyId);

    if (isFavorited) {
      return this.removeFavorite(propertyId).pipe(map(() => false));
    }

    return this.http.post<ApiResponse<Favorite>>(`${this.apiUrl}/${propertyId}`, {}).pipe(
      tap(() => {
        const ids = new Set(this.favoriteIdsSubject.value);
        ids.add(propertyId);
        this.favoriteIdsSubject.next(ids);
      }),
      map(() => true)
    );
  }

  removeFavorite(propertyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${propertyId}`).pipe(
      tap(() => {
        const ids = new Set(this.favoriteIdsSubject.value);
        ids.delete(propertyId);
        this.favoriteIdsSubject.next(ids);
      })
    );
  }
}