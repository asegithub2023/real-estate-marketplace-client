import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Conversation {
  id: number;
  propertyTitle: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderName: string;
  content: string;
  sentAt: string;
  isMine: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  conversations: Conversation[] = [];

  selectedConversation: Conversation | null = null;

  messages: Message[] = [];

  newMessage = '';

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;

    // Temporary UI data.
    // This will later be replaced with the Messages API.
    this.messages = [];
  }

  sendMessage(): void {
    const content = this.newMessage.trim();

    if (!content || !this.selectedConversation) {
      return;
    }

    this.messages.push({
      id: Date.now(),
      senderName: 'You',
      content,
      sentAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isMine: true
    });

    this.newMessage = '';
  }
}