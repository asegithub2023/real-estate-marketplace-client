export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
}

export interface CreateMessageRequest {
  conversationId: number;
  content: string;
}
