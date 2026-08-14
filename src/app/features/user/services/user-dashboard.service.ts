import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  getDashboardStats(): Observable<DashboardStats> {
    return of({
      totalProperties: 0,
      activeProperties: 0,
      favorites: 0,
      unreadNotifications: 0
    });
  }
}
