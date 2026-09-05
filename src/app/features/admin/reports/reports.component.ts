import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ReportService } from '../../../services/report.service';
import { Report, ReportStatus } from '../../../models/report';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

  private readonly reportService = inject(ReportService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly ReportStatus = ReportStatus;

  reports: Report[] = [];

  loading = false;
  error = '';

  updatingReportId: number | null = null;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.error = '';

    this.reportService.getAllReports().subscribe({
      next: (reports) => {
        this.reports = reports;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load reports.';
        this.cdr.markForCheck();
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case ReportStatus.Reviewed:
        return 'Resolved';
      case ReportStatus.Dismissed:
        return 'Dismissed';
      default:
        return 'Pending';
    }
  }

  updateStatus(report: Report, status: number): void {
    this.updatingReportId = report.id;

    this.reportService.updateReportStatus(report.id, status).subscribe({
      next: (updated) => {
        report.status = updated.status;
        this.updatingReportId = null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Unable to update report status.';
        this.updatingReportId = null;
        this.cdr.markForCheck();
      }
    });
  }
}
