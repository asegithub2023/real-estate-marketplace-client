import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { PropertyService } from '../../../services/property';
import { ReportService } from '../../../services/report.service';
import { ReportStatus } from '../../../models/report';
import { getPropertyStatusLabel, getPropertyStatusVariant } from '../../../shared/utils/property-status';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  description: string;
}

interface RecentProperty {
  title: string;
  location: string;
  price: string;
  status: string;
  variant: 'success' | 'warning' | 'danger';
}

interface RecentUser {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly propertyService = inject(PropertyService);
  private readonly reportService = inject(ReportService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;

  pendingReportCount: number | null = null;

  stats: StatCard[] = [
    { title: 'Total Users', value: '—', icon: 'bi-people', description: '' },
    { title: 'Properties', value: '—', icon: 'bi-buildings', description: '' },
    { title: 'Active Listings', value: '—', icon: 'bi-check-circle', description: 'Currently active' }
  ];

  recentProperties: RecentProperty[] = [];
  recentUsers: RecentUser[] = [];

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      users: this.authService.getAllUsers(),
      properties: this.propertyService.getAllProperties(),
      reports: this.reportService.getAllReports()
    }).subscribe({
      next: ({ users, properties, reports }) => {
        const activeCount = properties.filter(p => Number(p.status) >= 2 && Number(p.status) !== 3).length;

        this.pendingReportCount = reports.filter(r => r.status === ReportStatus.Pending).length;

        this.stats = [
          { title: 'Total Users', value: users.length.toString(), icon: 'bi-people', description: 'Registered accounts' },
          { title: 'Properties', value: properties.length.toString(), icon: 'bi-buildings', description: 'Listed on the platform' },
          { title: 'Active Listings', value: activeCount.toString(), icon: 'bi-check-circle', description: 'Approved, available, sold or rented' }
        ];

        this.recentProperties = properties.slice(0, 3).map(p => ({
          title: p.title,
          location: p.city,
          price: `$${p.price.toLocaleString()}`,
          status: getPropertyStatusLabel(p.status),
          variant: getPropertyStatusVariant(p.status)
        }));

        this.recentUsers = users.slice(0, 3).map(u => ({
          name: u.fullName,
          email: u.email,
          role: u.role
        }));

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}