'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatHeader, MessageList, MessageInput } from '../_components';
import { ChatRoom, ChatUser, Message } from '../types';

// Mock current user
const mockCurrentUser: ChatUser = {
  id: 'current-user',
  firstName: 'John',
  lastName: 'Doe',
  isOnline: true,
};

// Mock chat rooms data
const mockChatRooms: { [key: string]: ChatRoom } = {
  '1': {
    id: '1',
    roomId: 'room-1',
    participants: [
      mockCurrentUser,
      {
        id: 'user-1',
        firstName: 'Sarah',
        lastName: 'Chen',
        profilePicture: 'https://i.pinimg.com/736x/79/43/be/7943be8d78be7e10f5c4f270b386755f.jpg',
        isOnline: true,
      }
    ],
    messages: [
      {
        id: '1',
        text: 'Hey cutie, what are you up to? 😉',
        messageType: 'text',
        senderId: 'user-1',
        timestamp: new Date(Date.now() - 3600000),
        isOwn: false,
        status: 'read',
      },
      {
        id: '2',
        text: 'Just waiting for your message… looks like my wish came true 😘',
        messageType: 'text',
        senderId: 'current-user',
        timestamp: new Date(Date.now() - 3500000),
        isOwn: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'You might just be my favorite notification today 😏',
        messageType: 'text',
        senderId: 'user-1',
        timestamp: new Date(Date.now() - 1800000),
        isOwn: false,
        status: 'delivered',
      },
    ],
    isActive: true,
    roomType: 'direct',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 1800000),
  },
  '2': {
    id: '2',
    roomId: 'room-2',
    participants: [
      mockCurrentUser,
      {
        id: 'user-2',
        firstName: 'Mike',
        lastName: 'Rivera',
        profilePicture: 'https://i.pinimg.com/736x/ee/3c/70/ee3c70861f89fbabf2132e544bee7d9a.jpg',
        isOnline: false,
      }
    ],
    messages: [
      {
        id: '4',
        text: 'You know… I cant stop thinking about our chat earlier 👀',
        messageType: 'text',
        senderId: 'user-2',
        timestamp: new Date(Date.now() - 7200000),
        isOwn: false,
        status: 'read',
      },
      {
        id: '5',
        text: 'Good, because I was hoping I was on your mind 😏',
        messageType: 'text',
        senderId: 'current-user',
        timestamp: new Date(Date.now() - 7100000),
        isOwn: true,
        status: 'read',
      },
      {
        id: '6',
        text: 'Careful, you are kinda addictive 🔥',
        messageType: 'text',
        senderId: 'user-2',
        timestamp: new Date(Date.now() - 3600000),
        isOwn: false,
        status: 'delivered',
      },
    ],
    isActive: true,
    roomType: 'direct',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  '3': {
    id: '3',
    roomId: 'room-3',
    participants: [
      mockCurrentUser,
      {
        id: 'user-3',
        firstName: 'Luna',
        lastName: 'Starweaver',
        profilePicture: 'https://i.pinimg.com/736x/51/2f/03/512f03d5b6a387f7e468700dc3aa87fa.jpg',
        isOnline: true,
      }
    ],
    messages: [
      {
        id: '7',
        text: 'Talking to you feels way more fun than anything else I should be doing right now 😘',
        messageType: 'text',
        senderId: 'user-3',
        timestamp: new Date(Date.now() - 1800000),
        isOwn: false,
        status: 'read',
      },
      {
        id: '8',
        text: "You've officially become my favorite distraction 💕",
        messageType: 'text',
        senderId: 'user-3',
        timestamp: new Date(Date.now() - 900000),
        isOwn: false,
        status: 'sent',
      },
    ],
    isActive: true,
    roomType: 'direct',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 900000),
  },
};

const ChatRoomPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load chat room data
  useEffect(() => {
    const loadChatRoom = () => {
      const room = mockChatRooms[chatId];
      if (room) {
        // Mark all messages as read when opening the chat
        const updatedRoom = {
          ...room,
          messages: room.messages.map(msg => ({
            ...msg,
            status: msg.isOwn ? msg.status : 'read' // Only mark other user's messages as read
          }))
        };
        setChatRoom(updatedRoom);
      }
      setIsLoading(false);
    };

    if (chatId) {
      loadChatRoom();
    }
  }, [chatId]);

  // Mark messages as read when they come into view (additional effect for real-time)
  useEffect(() => {
    if (chatRoom) {
      const hasUnreadMessages = chatRoom.messages.some(msg => 
        !msg.isOwn && msg.status !== 'read'
      );
      
      if (hasUnreadMessages) {
        console.log(`Marking messages in chat ${chatId} as read`); // Debug log
        // Simulate API call to mark messages as read
        setTimeout(() => {
          setChatRoom(prev => prev ? {
            ...prev,
            messages: prev.messages.map(msg => ({
              ...msg,
              status: msg.isOwn ? msg.status : 'read'
            }))
          } : null);
        }, 500); // Small delay to simulate API call
      }
    }
  }, [chatId, chatRoom?.messages.length, chatRoom]); // Added chatRoom to dependencies

  const handleSendMessage = () => {
    if (!message.trim() || !chatRoom) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      messageType: 'text',
      senderId: mockCurrentUser.id,
      timestamp: new Date(),
      isOwn: true,
      status: 'sending',
    };

    // Update local state immediately
    setChatRoom(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    setMessage('');

    // Simulate API call and response
    setTimeout(() => {
      // Update message status to sent
      setChatRoom(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      } : null);

      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "You have such a beautiful vibe, I feel drawn to you ✨",
          "I'm really glad we matched, it feels special 💫",
          "Your words make me smile more than you know 😊",
          "Thank you for sharing that, it really shows your genuine side 💕",
          "I can already feel a spark between us 🔥"
        ];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          messageType: 'text',
          senderId: getOtherUser()?.id || '',
          timestamp: new Date(),
          isOwn: false,
          status: 'sent',
        };

        setChatRoom(prev => prev ? {
          ...prev,
          messages: [...prev.messages, responseMessage]
        } : null);
      }, 1000 + Math.random() * 2000);
    }, 500);
  };

  const handleVoiceRecord = (audioBlob: Blob) => {
    // TODO: Implement voice message upload
    console.log('Voice message recorded:', audioBlob);
  };

  const handleImageSelect = (file: File) => {
    // TODO: Implement image upload
    console.log('Image selected:', file);
  };

  const handleFileSelect = (file: File) => {
    // TODO: Implement file upload
    console.log('File selected:', file);
  };

  const handleBack = () => {
    // On mobile, go back to chat list, on desktop, close the chat
    router.push('/chat');
  };

  const handleCall = () => {
    // TODO: Implement voice call
    console.log('Voice call initiated');
    alert('Voice call feature is not implemented yet.');
  };

  const handleVideoCall = () => {
    // TODO: Implement video call
    console.log('Video call initiated');
    alert('Voice call feature is not implemented yet.');
  };

  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log('More options clicked');
    alert('More options feature is not implemented yet.');
  };

  const getOtherUser = (): ChatUser | undefined => {
    return chatRoom?.participants.find(p => p.id !== mockCurrentUser.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
        <h2 className="text-xl font-semibold text-gray-800">Chat not found</h2>
        <p className="text-gray-600 text-center">This conversation might have been deleted or does not exist.</p>
        <button
          onClick={handleBack}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Back to Chats
        </button>
      </div>
    );
  }

  const otherUser = getOtherUser();

  if (!otherUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
        <h2 className="text-xl font-semibold text-gray-800">Invalid chat room</h2>
        <p className="text-gray-600 text-center">Unable to load chat participants.</p>
        <button
          onClick={handleBack}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Back to Chats
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-0 overflow-hidden">
      {/* Chat Header */}
      <ChatHeader
        user={otherUser}
        onBack={handleBack}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
        onMoreOptions={handleMoreOptions}
        showBackButton={true}
      />

      {/* Messages */}
      <MessageList
        messages={chatRoom.messages}
        currentUserId={mockCurrentUser.id}
        className="flex-1 min-h-0"
      />

      {/* Message Input */}
      <MessageInput
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onVoiceRecord={handleVoiceRecord}
        onImageSelect={handleImageSelect}
        onFileSelect={handleFileSelect}
        placeholder={`Message ${otherUser.firstName}...`}
      />
    </div>
  );
};

export default ChatRoomPage;