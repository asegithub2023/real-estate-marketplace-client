import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Report } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reports`;

  createReport(propertyId: number, reason: string): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, { propertyId, reason });
  }

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }

  updateReportStatus(id: number, status: number): Observable<Report> {
    return this.http.patch<Report>(`${this.apiUrl}/${id}/status`, { status });
  }
}
