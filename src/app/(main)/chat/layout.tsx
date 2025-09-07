"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatSidebar } from "./_components";
import { Chat, ChatUser } from "./types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const mockCurrentUser: ChatUser = {
  id: "current-user",
  firstName: "John",
  lastName: "Doe",
  isOnline: true,
};

const mockChats: Chat[] = [
  {
    id: "1",
    roomId: "room-1",
    participants: [
      mockCurrentUser,
      {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Chen",
        profilePicture:
          "https://i.pinimg.com/736x/79/43/be/7943be8d78be7e10f5c4f270b386755f.jpg",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "msg-1",
      text: "You might just be my favorite notification today 😏",
      messageType: "text",
      senderId: "user-1",
      timestamp: new Date(Date.now() - 1800000),
      isOwn: false,
      status: "delivered",
    },
    unreadCount: 2,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: "2",
    roomId: "room-2",
    participants: [
      mockCurrentUser,
      {
        id: "user-2",
        firstName: "Mike",
        lastName: "Rivera",
        profilePicture:
          "https://i.pinimg.com/736x/ee/3c/70/ee3c70861f89fbabf2132e544bee7d9a.jpg",
        isOnline: false,
      },
    ],
    lastMessage: {
      id: "msg-2",
      text: "Careful, you are kinda addictive 🔥",
      messageType: "text",
      senderId: "user-2",
      timestamp: new Date(Date.now() - 7200000),
      isOwn: false,
      status: "delivered",
    },
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    roomId: "room-3",
    participants: [
      mockCurrentUser,
      {
        id: "user-3",
        firstName: "Luna",
        lastName: "Starweaver",
        profilePicture:
          "https://i.pinimg.com/736x/51/2f/03/512f03d5b6a387f7e468700dc3aa87fa.jpg",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "msg-3",
      text: "You've officially become my favorite distraction 💕",
      messageType: "text",
      senderId: "user-3",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
      status: "sent",
    },
    unreadCount: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 3600000),
  },
];

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const isSpecificChat = pathname.startsWith("/chat/") && pathname !== "/chat";
  const currentChatId = isSpecificChat ? pathname.split("/chat/")[1] : null;

  useEffect(() => {
    if (currentChatId) {
      markChatAsRead(currentChatId);
    }
  }, [currentChatId]);

  const markChatAsRead = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadCount: 0,
            lastMessage: chat.lastMessage
              ? {
                  ...chat.lastMessage,
                  status: "read",
                }
              : undefined,
          };
        }
        return chat;
      })
    );
  };

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="flex h-[calc(100vh-4.5rem)] max-h-screen overflow-hidden">
      <div
        className={`${
          isSpecificChat ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-[400px] flex-shrink-0`}
      >
        <div className="w-full h-full overflow-hidden">
          <ChatSidebar
            chats={chats}
            selectedChatId={currentChatId || undefined}
            onChatSelect={handleChatSelect}
            currentUserId={mockCurrentUser.id}
          />
        </div>
      </div>

      <div
        className={`${
          isSpecificChat ? "flex w-full" : "hidden md:flex"
        } flex-1 flex-col min-h-0 overflow-hidden`}
      >
        {isSpecificChat ? (
          <div className="flex flex-col h-full overflow-hidden">{children}</div>
        ) : (
          <div className="flex flex-1 flex-col items-center  bg-white overflow-y-auto">
            <div className="max-w-lg text-center ">
              <div className="flex">
                <Image
                  src={"/messages_trans.png"}
                  alt="No messages"
                  width={400}
                  height={340}
                  className="max-w-full h-auto"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800">
                  Select a conversation
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose from your existing conversations or start a new one
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => router.push("/find-match")}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors duration-200 text-sm"
                >
                  Find New Matches
                </Button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
