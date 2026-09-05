import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PagedRequest } from '../models/paged-request';
import { PagedResponse } from '../models/paged-response';
import { ApiResponse, Property, UpdatePropertyRequest } from '../models/property';

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

  getPropertiesByOwner(ownerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  updatePropertyStatus(id: number, status: number): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, { status });
  }

  updateProperty(id: number, request: UpdatePropertyRequest): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, request);
  }

  addPropertyImages(id: number, formData: FormData): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/${id}/images`, formData);
  }

  deletePropertyImage(id: number, imageId: number): Observable<Property> {
    return this.http.delete<Property>(`${this.apiUrl}/${id}/images/${imageId}`);
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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

  if (request.propertyType !== undefined) {
    params['propertyType'] = request.propertyType;
  }

  if (request.listingType !== undefined) {
    params['listingType'] = request.listingType;
  }

  if (request.sortBy) {
    params['sortBy'] = request.sortBy;
  }

  return params;
}
}
