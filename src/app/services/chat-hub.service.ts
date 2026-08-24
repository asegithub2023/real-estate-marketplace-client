import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Conversation } from '../models/conversation';
import { Message } from '../models/message';

/**
 * Thin wrapper around the SignalR connection to /hubs/chat. Owns exactly one
 * connection for the whole app session; components subscribe to the exposed
 * observables and call join/leaveConversation for the thread they have open.
 */
@Injectable({ providedIn: 'root' })
export class ChatHubService {
  private readonly authService = inject(AuthService);

  private connection: HubConnection | null = null;

  private readonly messageReceivedSource = new Subject<Message>();
  private readonly conversationUpdatedSource = new Subject<Conversation>();

  readonly messageReceived$ = this.messageReceivedSource.asObservable();
  readonly conversationUpdated$ = this.conversationUpdatedSource.asObservable();

  async start(): Promise<void> {
    if (this.connection && this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    // The hub is mapped at the app root, not under the /api/v1 REST prefix.
    const hubUrl = `${environment.apiUrl.replace(/\/api\/v\d+\/?$/, '')}/hubs/chat`;

    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.authService.getToken() ?? '',
        // No cookies are used for auth (Bearer token only), so this avoids
        // requiring the backend CORS policy to allow credentials.
        withCredentials: false
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('ReceiveMessage', (message: Message) => {
      this.messageReceivedSource.next(message);
    });

    this.connection.on('ConversationUpdated', (conversation: Conversation) => {
      this.conversationUpdatedSource.next(conversation);
    });

    try {
      await this.connection.start();
    } catch (error) {
      // Realtime is a progressive enhancement here - REST calls still work if
      // the socket can't connect (e.g. briefly during a server restart).
      console.error('SignalR connection failed to start:', error);
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) {
      return;
    }

    await this.connection.stop();
    this.connection = null;
  }

  async joinConversation(conversationId: number): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('JoinConversation', conversationId);
    }
  }

  async leaveConversation(conversationId: number): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('LeaveConversation', conversationId);
    }
  }
}