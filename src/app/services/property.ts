import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreatePropertyRequest } from '../models/create-property-request';
import { PagedRequest } from '../models/paged-request';
import { PagedResponse } from '../models/paged-response';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly apiUrl = `${environment.apiUrl}/properties`;

  constructor(private readonly http: HttpClient) {}

  getProperties(request: PagedRequest): Observable<PagedResponse<Property>> {
    return this.http.get<PagedResponse<Property>>(`${this.apiUrl}/search`, { params: this.buildParams(request) });
  }

  createProperty(request: CreatePropertyRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  private buildParams(request: PagedRequest): any {
    const params: any = {};
    if (request.page !== undefined) params['page'] = request.page;
    if (request.pageSize !== undefined) params['pageSize'] = request.pageSize;
    if (request.search) params['search'] = request.search;
    if (request.orderBy) params['orderBy'] = request.orderBy;
    if (request.descending !== undefined) params['descending'] = request.descending;
    return params;
  }
}