export interface Conversation {
  id: number;

  propertyId: number;
  propertyTitle: string;
  propertyImageUrl: string | null;

  buyerId: number;
  ownerId: number;

  otherUserId: number;
  otherUserName: string;

  createdAt: string;

  lastMessageContent: string | null;
  lastMessageAt: string | null;

  unreadCount: number;
}

export interface CreateConversationRequest {
  propertyId: number;
}