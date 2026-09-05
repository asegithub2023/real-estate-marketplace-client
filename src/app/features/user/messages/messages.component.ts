import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Conversation } from '../../../models/conversation';
import { Message } from '../../../models/message';
import { ConversationService } from '../../../services/conversation.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { ChatHubService } from '../../../services/chat-hub.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit, OnDestroy {

  private readonly conversationService = inject(ConversationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly chatHubService = inject(ChatHubService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly currentUserId = this.authService.getCurrentUserId();

  private messageSub?: Subscription;
  private conversationSub?: Subscription;

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];

  newMessage = '';

  isLoadingConversations = false;
  isLoadingMessages = false;
  isSending = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    // Start realtime delivery before loading the conversation list.
    await this.chatHubService.start();

    this.messageSub = this.chatHubService.messageReceived$.subscribe(
      message => this.onMessageReceived(message)
    );
    this.conversationSub = this.chatHubService.conversationUpdated$.subscribe(
      conversation => this.onConversationUpdated(conversation)
    );

    this.loadConversations();
  }

  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
    this.conversationSub?.unsubscribe();

    if (this.selectedConversation) {
      this.chatHubService.leaveConversation(this.selectedConversation.id);
    }

    this.chatHubService.stop();
  }

  loadConversations(): void {
    this.isLoadingConversations = true;
    this.errorMessage = '';

    this.conversationService.getMyConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.isLoadingConversations = false;

        const requestedId = Number(this.route.snapshot.queryParamMap.get('conversationId'));
        const toOpen = requestedId
          ? conversations.find(c => c.id === requestedId)
          : conversations[0];

        if (toOpen) {
          this.selectConversation(toOpen);
        }

        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingConversations = false;
        this.errorMessage = 'Unable to load conversations. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    if (this.selectedConversation && this.selectedConversation.id !== conversation.id) {
      this.chatHubService.leaveConversation(this.selectedConversation.id);
    }

    this.selectedConversation = conversation;
    this.messages = [];
    this.isLoadingMessages = true;
    this.errorMessage = '';

    conversation.unreadCount = 0;

    this.chatHubService.joinConversation(conversation.id);

    this.messageService.getMessages(conversation.id).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoadingMessages = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingMessages = false;
        this.errorMessage = 'Unable to load messages.';
        this.cdr.markForCheck();
      }
    });
  }

  sendMessage(): void {
    const content = this.newMessage.trim();

    if (!content || !this.selectedConversation || this.isSending) {
      return;
    }

    this.isSending = true;

    this.messageService.sendMessage(this.selectedConversation.id, content).subscribe({
      next: (message) => {
        this.appendMessage(message);
        this.newMessage = '';
        this.isSending = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSending = false;
        this.errorMessage = 'Unable to send message. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  private onMessageReceived(message: Message): void {
    if (this.selectedConversation?.id === message.conversationId) {
      this.appendMessage(message);
      this.cdr.markForCheck();
    }
  }

  private appendMessage(message: Message): void {

    // SignalR may echo a message already returned by the POST request.
    if (!this.messages.some(m => m.id === message.id)) {
      this.messages.push(message);
    }
  }

  private onConversationUpdated(updated: Conversation): void {
    const index = this.conversations.findIndex(c => c.id === updated.id);

    if (index === -1) {

      this.conversations.unshift(updated);
    } else {
      this.conversations[index] = updated;
    }

    if (this.selectedConversation?.id === updated.id) {
      this.selectedConversation = updated;
      updated.unreadCount = 0;
    }

    this.conversations.sort((a, b) =>
      new Date(b.lastMessageAt ?? b.createdAt).getTime()
      - new Date(a.lastMessageAt ?? a.createdAt).getTime()
    );

    this.cdr.markForCheck();
  }

  isMine(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  formatTime(dateStr: string | null): string {
    if (!dateStr) {
      return '';
    }
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
