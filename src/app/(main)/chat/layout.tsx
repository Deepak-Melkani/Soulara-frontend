"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatSidebar } from "./_components";
import { Chat, ChatUser } from "./types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useChatData } from "@/hooks/useChatData";
import { Loader2 } from "lucide-react";

const mockChats: Chat[] = [];

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { chats, loading, error, currentUser, refreshChats } = useChatData();

  const isSpecificChat = pathname.startsWith("/chat/") && pathname !== "/chat";
  const currentChatId = isSpecificChat ? pathname.split("/chat/")[1] : null;

  useEffect(() => {
    if (currentChatId) {
      // Mark chat as read - this could be handled by the backend
      console.log(`Marking chat ${currentChatId} as read`);
      // TODO: Implement mark as read API call
    }
  }, [currentChatId]);

  const markChatAsRead = (chatId: string) => {
    // This would ideally make an API call to mark messages as read
    console.log(`Marking chat ${chatId} as read`);
    // For now, we'll let the backend handle this when messages are fetched
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                <p className="text-gray-600">Loading chats...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={refreshChats} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <ChatSidebar
              chats={chats}
              selectedChatId={currentChatId || undefined}
              onChatSelect={handleChatSelect}
              currentUserId={currentUser?.id || ""}
            />
          )}
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
