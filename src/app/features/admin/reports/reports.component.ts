import { Component } from '@angular/core';

interface Report {
  id: number;
  property: string;
  reporter: string;
  reason: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  reports: Report[] = [
    {
      id: 1,
      property: 'Modern Family House',
      reporter: 'Abebe Kebede',
      reason: 'Incorrect property information',
      date: 'Aug 14, 2026',
      status: 'Pending'
    },
    {
      id: 2,
      property: 'Luxury Apartment',
      reporter: 'Sara Ahmed',
      reason: 'Suspicious listing',
      date: 'Aug 13, 2026',
      status: 'Pending'
    },
    {
      id: 3,
      property: 'Commercial Building',
      reporter: 'John Doe',
      reason: 'Duplicate listing',
      date: 'Aug 10, 2026',
      status: 'Resolved'
    }
  ];

  updateStatus(report: Report, status: string): void {
    report.status = status;
  }
}
