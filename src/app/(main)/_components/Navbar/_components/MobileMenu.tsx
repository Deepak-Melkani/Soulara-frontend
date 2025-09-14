"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import NavbarItem from './NavbarItem'
import VibeCoinDisplay from './VibeCoinDisplay'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  userCoins: number
  notificationCount?: number
  chatCount?: number
  className?: string
}

const MobileMenu = ({ userCoins, notificationCount, chatCount, className }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className={cn(
            "md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            className
          )}
          aria-label="Open navigation menu"
        >
          <svg
            className="h-6 w-6 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <SheetTitle className="text-left font-playfair text-xl text-foreground">
            Navigation
          </SheetTitle>
          <SheetDescription className="text-left text-sm text-muted-foreground">
            Access your account and features
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col space-y-2 p-6">
          <div className="mb-4">
            <VibeCoinDisplay coins={userCoins} className="w-full justify-center" />
          </div>
          
          <div className="space-y-3">
            <div className="w-full">
              <NavbarItem
                href="/profile"
                icon={
                  <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                label="Profile"
                className="w-full justify-start px-4 py-3 rounded-xl hover:bg-accent/80"
                onClick={handleLinkClick}
              />
            </div>

            <div className="w-full">
              <NavbarItem
                href="/profile?tab=notifications"
                icon={
                  <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5-5-5h5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17V3a2 2 0 00-2-2H7a2 2 0 00-2 2v14l5-5 5 5z"
                    />
                  </svg>
                }
                label="Notifications"
                badge={notificationCount && notificationCount > 0 ? notificationCount : undefined}
                className="w-full justify-start px-4 py-3 rounded-xl hover:bg-accent/80"
                onClick={handleLinkClick}
              />
            </div>

            <div className="w-full">
              <NavbarItem
                href="/chat"
                icon={
                  <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                }
                label="Chats"
                badge={chatCount && chatCount > 0 ? chatCount : undefined}
                className="w-full justify-start px-4 py-3 rounded-xl hover:bg-accent/80"
                onClick={handleLinkClick}
              />
            </div>

            <div className="w-full">
              <NavbarItem
                href="/find-match"
                icon={
                  <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                }
                label="Find Matches"
                className="w-full justify-start px-4 py-3 rounded-xl hover:bg-accent/80"
                onClick={handleLinkClick}
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border space-y-3">
            <Link 
              href="/profile?tab=account"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-accent/80 transition-colors text-left"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-foreground">Settings</span>
            </Link>
            
            <Link 
              href="/help"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-accent/80 transition-colors text-left"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-foreground">Help & Support</span>
            </Link>

            <Link 
              href="/discover"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-accent/80 transition-colors text-left"
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-medium text-foreground">Discover</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
