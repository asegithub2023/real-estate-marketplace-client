import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Message, CreateMessageRequest } from '../models/message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);

  // Backend route is singular: MessageController -> [controller] token = "Message"
  // (NOT "/messages" - see the note at the top of MessagesController.cs).
  private readonly apiUrl = `${environment.apiUrl}/message`;

  getMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${conversationId}`);
  }

  sendMessage(conversationId: number, content: string): Observable<Message> {
    const request: CreateMessageRequest = { conversationId, content };
    return this.http.post<Message>(this.apiUrl, request);
  }
}