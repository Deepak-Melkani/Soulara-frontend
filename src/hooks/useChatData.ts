"use client";

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { Chat, ChatUser, Message } from '@/app/(main)/chat/types';
import { toast } from 'sonner';

interface CreateRoomResponse {
  success?: boolean;
  message: string;
  data?: any;
  roomId?: string;
}

interface GetChatsResponse {
  success: boolean;
  chats: Array<{
    chat: {
      _id: string;
      users: string[];
      createdAt: string;
      updatedAt: string;
      lastMessage?: string;
      unseenCount: number;
      isActive: boolean;
      // New structured format
      currentUser: {
        id: string;
        role: "currentUser";
      };
      otherUser: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
        role: "otherUser";
      };
      // Legacy fields for backward compatibility
      profilePhoto?: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

interface GetMessagesResponse {
  success?: boolean;
  message?: string;
  messages?: Array<{
    _id: string;
    sender: string;
    receiver?: string;
    message?: string;
    image?: {
      url: string;
      publicId: string;
    };
    messageType: 'text' | 'image' | 'audio';
    createdAt: string;
    seenStatus: boolean;
    deliveredStatus: 'sending' | 'sent' | 'delivered' | 'failed';
  }>;
  room?: {
    id: string;
    currentUser: {
      id: string;
      role: "currentUser";
    };
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture?: string;
      role: "otherUser";
    };
  };
  // Legacy field for backward compatibility
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    avatar?: string;
    [key: string]: any;
  };
}

export const useChatData = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);

  // Get current user info
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setCurrentUser({
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar || userData.profilePicture,
            isOnline: true,
          });
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  // Transform backend chat data to frontend format
  const transformChatData = useCallback((backendChats: GetChatsResponse['chats'], currentUserId: string): Chat[] => {
    return backendChats.map((item) => {
      const { chat } = item;
      
      // Use the new structured format if available, otherwise fall back to legacy
      const otherUser = chat.otherUser || {
        id: chat.users.find(id => id !== currentUserId) || '',
        firstName: chat.firstName || 'Unknown',
        lastName: chat.lastName || 'User',
        profilePhoto: chat.profilePhoto,
        role: 'otherUser' as const
      };
      
      const currentUserInfo = chat.currentUser || {
        id: currentUserId,
        role: 'currentUser' as const
      };
      
      return {
        id: chat._id,
        roomId: chat._id,
        participants: [
          {
            id: currentUserInfo.id,
            firstName: currentUser?.firstName || 'You',
            lastName: currentUser?.lastName || '',
            isOnline: true,
          },
          {
            id: otherUser.id,
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
            profilePicture: otherUser.profilePhoto || undefined,
            isOnline: false,
          }
        ],
        lastMessage: chat.lastMessage ? {
          id: 'last-msg',
          text: chat.lastMessage,
          messageType: 'text',
          senderId: otherUser.id,
          timestamp: new Date(chat.updatedAt),
          isOwn: false,
          status: 'delivered',
        } : undefined,
        unreadCount: chat.unseenCount,
        isActive: chat.isActive,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
      };
    });
  }, [currentUser]);

  // Transform backend message data to frontend format
  const transformMessageData = useCallback((backendMessages: GetMessagesResponse['messages'], currentUserId: string): Message[] => {
    if (!backendMessages) return [];
    
    return backendMessages.map((msg) => ({
      id: msg._id,
      text: msg.message || '',
      messageType: msg.messageType === 'audio' ? 'voice' : msg.messageType as 'text' | 'image' | 'voice',
      senderId: msg.sender,
      timestamp: new Date(msg.createdAt),
      isOwn: msg.sender === currentUserId,
      status: msg.deliveredStatus,
      mediaUrl: msg.image?.url,
    }));
  }, []);

  // Fetch all chat rooms for current user
  const fetchChats = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<GetChatsResponse>('/chat/all', {
        method: 'GET',
      });
      
      if (response.success && response.chats) {
        const transformedChats = transformChatData(response.chats, currentUser.id);
        setChats(transformedChats);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [currentUser, transformChatData]);

  // Create or get existing chat room
  const createOrGetChatRoom = useCallback(async (otherUserId: string): Promise<string | null> => {
    try {
      const response = await apiRequest<CreateRoomResponse>('/chat/new', {
        method: 'POST',
        body: JSON.stringify({ receiverId: otherUserId }),
      });
      
      console.log('Chat room response:', response);
      
      // For new room: {"message": "New room created", "roomId": "..."}
      if (response.roomId) {
        return response.roomId;
      }
      
      // For existing room: {"message": "Chat room already exists", "data": existingRoom}
      if (response.data && response.data._id) {
        return response.data._id;
      }
      
      console.error('No room ID found in response:', response);
      toast.error('Failed to get room ID from response');
      return null;
    } catch (err) {
      console.error('Error creating/getting chat room:', err);
      toast.error('Failed to start chat');
      return null;
    }
  }, []);

  // Fetch messages for a specific room (simple version)
  const fetchMessages = useCallback(async (roomId: string): Promise<Message[]> => {
    if (!currentUser) return [];
    
    try {
      const response = await apiRequest<GetMessagesResponse>(`/chat/message/${roomId}`, {
        method: 'GET',
      });
      
      if (response.messages) {
        return transformMessageData(response.messages, currentUser.id);
      }
      return [];
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
      return [];
    }
  }, [currentUser, transformMessageData]);

  // Fetch messages and room user info
  const fetchRoomWithMessages = useCallback(async (roomId: string): Promise<{
    messages: Message[];
    user: ChatUser | null;
  }> => {
    if (!currentUser) return { messages: [], user: null };
    
    try {
      const response = await apiRequest<GetMessagesResponse>(`/chat/message/${roomId}`, {
        method: 'GET',
      });
      
      const messages = response.messages ? transformMessageData(response.messages, currentUser.id) : [];
      
      // Prefer the new structured format, fall back to legacy
      let user: ChatUser | null = null;
      
      if (response.room?.otherUser) {
        user = {
          id: response.room.otherUser.id,
          firstName: response.room.otherUser.firstName,
          lastName: response.room.otherUser.lastName,
          avatar: response.room.otherUser.profilePicture,
          profilePicture: response.room.otherUser.profilePicture,
          isOnline: false, // Will be updated by socket
        };
      } else if (response.user) {
        // Legacy format fallback
        user = {
          id: response.user._id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          avatar: response.user.avatar || response.user.profilePicture,
          profilePicture: response.user.profilePicture,
          isOnline: false, // Will be updated by socket
        };
      }

      return { messages, user };
    } catch (err) {
      console.error('Error fetching room data:', err);
      toast.error('Failed to load chat data');
      return { messages: [], user: null };
    }
  }, [currentUser, transformMessageData]);

  // Send a message
  const sendMessage = useCallback(async (roomId: string, message: string, messageType: 'text' | 'image' | 'voice' = 'text', imageData?: any) => {
    if (!currentUser) return false;

    try {
      const messageData: any = {
        roomId,
        text: messageType === 'text' ? message : undefined, // Changed from 'message' to 'text'
        messageType: messageType === 'voice' ? 'audio' : messageType, // Convert voice back to audio for backend
      };

      if (messageType === 'image' && imageData) {
        messageData.file = imageData; // Changed from 'image' to 'file' to match backend
      }

      console.log('Sending message data:', messageData);
      
      const response = await apiRequest<{message: any; sender: string}>('/chat/message', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });

      console.log('API response:', response);

      if (response.message && response.sender) {
        return true;
      }
      
      console.error('API call succeeded but unexpected response format', response);
      return false;
    } catch (err) {
      console.error('Error sending message:', err);
      // Log the full error details
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      toast.error('Failed to send message');
      return false;
    }
  }, [currentUser]);

  // Initial load
  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser, fetchChats]);

  return {
    chats,
    loading,
    error,
    currentUser,
    fetchChats,
    fetchMessages,
    fetchRoomWithMessages,
    sendMessage,
    createOrGetChatRoom,
    refreshChats: fetchChats,
  };
};