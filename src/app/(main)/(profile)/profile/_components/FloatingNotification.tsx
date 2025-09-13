'use client'

import React, { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import NotificationsPanel from './NotificationsPanel'
import { NotificationItem } from '../types'

interface FloatingNotificationProps {
  notifications: NotificationItem[]
  onNotificationClick?: (notification: NotificationItem) => void
  onMarkAsRead?: (notificationId: string) => void
}

export default function FloatingNotification({ 
  notifications, 
  onNotificationClick, 
  onMarkAsRead 
}: FloatingNotificationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div suppressHydrationWarning>
      
      <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-shadow bg-primary-600 hover:bg-primary-700 relative"
            >
              <Bell className="w-5 h-5" />
             
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
            <SheetHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <NotificationsPanel 
                notifications={notifications}
                onNotificationClick={onNotificationClick}
                onMarkAsRead={onMarkAsRead}
                hideHeader={true}
                className="h-full"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-shadow bg-white relative"
            >
              <Bell className="w-4 h-4" />
              
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-md p-0">
            <SheetHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-hidden p-1">
              <NotificationsPanel 
                notifications={notifications}
                onNotificationClick={onNotificationClick}
                onMarkAsRead={onMarkAsRead}
                hideHeader={true}
                className="h-full"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
