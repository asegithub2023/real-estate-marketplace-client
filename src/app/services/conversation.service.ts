import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Conversation, CreateConversationRequest } from '../models/conversation';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/conversations`;

  getMyConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/user/me`);
  }

  getConversationById(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/${id}`);
  }

  startConversation(propertyId: number): Observable<Conversation> {
    const request: CreateConversationRequest = { propertyId };
    return this.http.post<Conversation>(this.apiUrl, request);
  }
}
