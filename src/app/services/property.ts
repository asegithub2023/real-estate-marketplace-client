import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PagedRequest } from '../models/paged-request';
import { PagedResponse } from '../models/paged-response';
import { ApiResponse, Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly apiUrl = `${environment.apiUrl}/properties`;

  constructor(private readonly http: HttpClient) {}

  getProperties(request: PagedRequest): Observable<PagedResponse<Property>> {
    return this.http.get<PagedResponse<Property>>(
      `${this.apiUrl}/search`,
      { params: this.buildParams(request) }
    );
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http
      .get<ApiResponse<Property>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /** Properties owned by a specific user - backend returns a plain array, not paged. */
  getPropertiesByOwner(ownerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  /** Every property on the platform - plain array, no pagination. Used by admin views. */
  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  updatePropertyStatus(id: number, status: number): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, { status });
  }
createProperty(formData: FormData): Observable<any> {
  return this.http.post<any>(this.apiUrl, formData);
}

  private buildParams(request: PagedRequest): any {
  const params: any = {};

  if (request.page !== undefined) {
    params['page'] = request.page;
  }

  if (request.pageSize !== undefined) {
    params['pageSize'] = request.pageSize;
  }

  if (request.search) {
    params['search'] = request.search;
  }

  if (request.orderBy) {
    params['orderBy'] = request.orderBy;
  }

  if (request.descending !== undefined) {
    params['descending'] = request.descending;
  }

  if (request.minPrice !== undefined) {
    params['minPrice'] = request.minPrice;
  }

  if (request.maxPrice !== undefined) {
    params['maxPrice'] = request.maxPrice;
  }

  if (request.minBedrooms !== undefined) {
    params['minBedrooms'] = request.minBedrooms;
  }

  if (request.minBathrooms !== undefined) {
    params['minBathrooms'] = request.minBathrooms;
  }

  if (request.city) {
    params['city'] = request.city;
  }

  if (request.sortBy) {
    params['sortBy'] = request.sortBy;
  }

  return params;
}
}