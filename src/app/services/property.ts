import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreatePropertyRequest } from '../models/create-property-request';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly apiUrl = `${environment.apiUrl}/properties`;

  constructor(private readonly http: HttpClient) {}

  createProperty(request: CreatePropertyRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }
}