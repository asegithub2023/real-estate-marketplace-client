import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Conversation {
  id: number;
  userName: string;
  propertyTitle: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

interface Message {
  id: number;
  content: string;
  time: string;
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

  conversations: Conversation[] = [
    {
      id: 1,
      userName: 'Abebe Kebede',
      propertyTitle: 'Modern House in Addis Ababa',
      lastMessage: 'Is the property still available?',
      time: '10:30 AM',
      unreadCount: 2
    },
    {
      id: 2,
      userName: 'Sara Ahmed',
      propertyTitle: 'Luxury Apartment',
      lastMessage: 'Thank you for the information.',
      time: 'Yesterday',
      unreadCount: 0
    }
  ];

  selectedConversation: Conversation | null = this.conversations[0];

  messages: Message[] = [
    {
      id: 1,
      content: 'Hello, is this property still available?',
      time: '10:20 AM',
      isMine: false
    },
    {
      id: 2,
      content: 'Yes, it is still available.',
      time: '10:22 AM',
      isMine: true
    },
    {
      id: 3,
      content: 'Great! I would like to know more about it.',
      time: '10:25 AM',
      isMine: false
    }
  ];

  newMessage = '';

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;

    conversation.unreadCount = 0;

    // Temporary frontend messages.
    // Backend API will be connected later.
  }

  sendMessage(): void {
    const content = this.newMessage.trim();

    if (!content || !this.selectedConversation) {
      return;
    }

    this.messages.push({
      id: Date.now(),
      content,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isMine: true
    });

    this.newMessage = '';
  }
}