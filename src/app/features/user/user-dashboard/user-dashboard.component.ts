import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardHeaderComponent } from '../components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../components/dashboard-sidebar/dashboard-sidebar.component';
import {
  DashboardStats,
  UserDashboardService
} from '../services/user-dashboard.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    DashboardHeaderComponent,
    DashboardSidebarComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {

  private readonly dashboardService = inject(UserDashboardService);
  private readonly cdr = inject(ChangeDetectorRef);

  stats: DashboardStats = {
    totalProperties: 0,
    activeProperties: 0,
    favorites: 0,
    unreadNotifications: 0
  };

  ngOnInit(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cdr.markForCheck();
      }
    });
  }
}