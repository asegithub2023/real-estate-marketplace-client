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

@Injectable({ providedIn: 'root' })
export class ChatHubService {
  private readonly authService = inject(AuthService);

  private connection: HubConnection | null = null;

  private readonly messageReceivedSource = new Subject<Message>();
  private readonly conversationUpdatedSource = new Subject<Conversation>();

  readonly messageReceived$ = this.messageReceivedSource.asObservable();
  readonly conversationUpdated$ = this.conversationUpdatedSource.asObservable();

  async start(): Promise<void> {
    // Avoid duplicate connections when views initialize more than once.
    if (this.connection && this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    const hubUrl = `${environment.apiUrl.replace(/\/api\/v\d+\/?$/, '')}/hubs/chat`;

    // SignalR receives the current JWT through the token factory.
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.authService.getToken() ?? '',

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
