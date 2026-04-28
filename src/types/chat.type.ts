export interface User {
  id: string;
  fullName: string;
  profileImage: string;
  isOnline: boolean;
  lastMessage?: string;
  unreadCount: number;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  images: string[];
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  reaction?: string;
  createdAt: string;
  seenAt?: string;
}