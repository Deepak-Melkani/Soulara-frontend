'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useChatRoom, useRealtimeMessages, useTypingIndicator, useOnlineStatus } from '@/hooks/useChat';
import ChatHeader from '../_components/ChatHeader';
import MessageList from '../_components/MessageList';
import MessageInput from '../_components/MessageInput';
import ConnectionStatus from '@/components/ConnectionStatus';
import { Message, ChatUser } from '../types';

interface ChatPageProps {}

const ChatPage: React.FC<ChatPageProps> = () => {
  const params = useParams();
  const { user } = useAuth();
  const { sendMessage, isConnected } = useSocket();
  
  // Local state
  const [message, setMessage] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [showMobileBack, setShowMobileBack] = useState(false);
  
  const chatUserId = params.id as string;
  
  // Generate room ID from user IDs (ensure consistent ordering)
  const roomId = user && chatUserId 
    ? [user._id, chatUserId].sort().join('-')
    : null;

  // Socket hooks
  const { isInRoom } = useChatRoom(roomId);
  const { 
    messages, 
    addMessage, 
    updateMessageStatus,
    setMessages 
  } = useRealtimeMessages(roomId, user?._id || '');
  
  const { 
    typingUsers, 
    handleTyping, 
    handleStopTyping 
  } = useTypingIndicator(roomId || '');
  const { onlineUsers } = useOnlineStatus();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setShowMobileBack(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load chat user data (mock for now - replace with API call)
  useEffect(() => {
    if (chatUserId) {
      // TODO: Replace with actual API call
      const mockUser: ChatUser = {
        id: chatUserId,
        firstName: 'Sarah',
        lastName: 'Johnson',
        profilePicture: '/assets/auth/login.png',
        isOnline: onlineUsers.includes(chatUserId),
        lastSeen: new Date()
      };
      setChatUser(mockUser);
    }
  }, [chatUserId, onlineUsers]);

  // Load chat history (mock for now - replace with API call)
  useEffect(() => {
    if (roomId && user) {
      // TODO: Replace with actual API call to load chat history
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hey there! How are you doing?',
          messageType: 'text',
          senderId: chatUserId,
          timestamp: new Date(Date.now() - 60000),
          status: 'read',
          isOwn: false
        },
        {
          id: '2',
          text: 'Hi! I\'m doing great, thanks for asking! How about you?',
          messageType: 'text',
          senderId: user._id,
          timestamp: new Date(Date.now() - 30000),
          status: 'read',
          isOwn: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [roomId, user, setMessages, chatUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !chatUserId || !roomId || !isConnected) {
      return;
    }

    // Create the message object
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      messageType: 'text',
      senderId: user._id,
      timestamp: new Date(),
      status: 'sending',
      isOwn: true
    };

    // Add to local state immediately for optimistic UI
    addMessage(newMessage);
    
    // Clear input
    setMessage('');
    
    // Stop typing
    handleStopTyping();

    try {
      // Send message using socket context
      sendMessage(roomId, message.trim(), 'text');
      
      // Update status to sent
      updateMessageStatus(newMessage.id, { status: 'sent' });
    } catch (error) {
      console.error('Failed to send message:', error);
      updateMessageStatus(newMessage.id, { status: 'failed' });
    }
  };

  const handleVoiceRecord = async (audioBlob: Blob) => {
    console.log('Voice recording received:', audioBlob);
    // TODO: Implement voice message sending
  };

  const handleImageSelect = async (file: File) => {
    console.log('Image selected:', file);
    // TODO: Implement image message sending
  };

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file);
    // TODO: Implement file message sending
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!user || !chatUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <ConnectionStatus />
        </div>
      )}

      <ChatHeader
        user={chatUser}
        onBack={handleBack}
        showBackButton={showMobileBack}
        isConnected={isConnected}
        typingUsers={typingUsers}
        onVideoCall={() => console.log('Video call')}
        onMoreOptions={() => console.log('More options')}
      />

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={user._id}
          className="h-full"
        />
      </div>

      <div className="border-t border-gray-200 bg-white p-3">
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
          onVoiceRecord={handleVoiceRecord}
          onImageSelect={handleImageSelect}
          onFileSelect={handleFileSelect}
          onStartTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!isConnected}
          placeholder={
            isConnected 
              ? "Type a message..." 
              : "Connecting..."
          }
        />
      </div>
    </div>
  );
};

export default ChatPage;