'use client'

import React, { Suspense, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import ClientOnly from '@/components/ClientOnly'
import ProfileSidebar from './_components/ProfileSidebar'
import ProfileDetailsForm from './_components/ProfileDetailsForm'
import NotificationsPanel from './_components/NotificationsPanel'
import FloatingNotification from './_components/FloatingNotification'
import { ProfileData, NotificationItem } from './types'

// Mock data - In a real app, this would come from your API/database
const mockProfileData: ProfileData = {
  id: '1',
  name: 'Kanika Johnson',
  age: 28,
  gender: 'female',
  preference: 'Mard',
  bio: 'Love hiking, photography, and good coffee. Looking for someone to share adventures with.',
  profilePicture: 'https://i.pinimg.com/1200x/57/38/13/57381305647d560708de3d83a1cfbb36.jpg',
  email: 'kanika.johnson@example.com',
  address: '123 Main St, San Francisco, CA 94105',
  phone: '+1 (555) 123-4567',
  agePreference: {
    min: 24,
    max: 35
  },
  privacy: 'public',
  socialLinks: {
    facebook: 'facebook.com/alexjohnson',
    instagram: '@alexjohnson',
    twitter: '@alexj'
  },
  subscription: {
    currentPlan: 'premium',
    active: true
  },
  lookingFor: 'relationship',
  stats: {
    crushes: 12,
    swipes: 89,
    matches: 23,
    views: 156
  }
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile has been successfully updated with new information.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    avatar: undefined
  },
  {
    id: '2',
    type: 'crush',
    title: 'New Crush!',
    message: 'Someone has a crush on you! Check out who it might be.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    avatar: '/public/assets/candid.jpg'
  },
  {
    id: '3',
    type: 'chat',
    title: 'New Message',
    message: 'You have a new message from Sarah Chen.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: true,
    avatar: '/public/assets/candid.jpg'
  },
  {
    id: '4',
    type: 'offers',
    title: 'Premium Upgrade',
    message: 'Upgrade to Premium and get unlimited swipes for just $9.99/month.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    avatar: undefined
  },
  {
    id: '5',
    type: 'system',
    title: 'Security Alert',
    message: 'Your account was accessed from a new device. Was this you?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    avatar: undefined
  },
  {
    id: '6',
    type: 'crush',
    title: 'Mutual Match!',
    message: 'You and Jessica Smith are now a mutual match! Start chatting.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: false,
    avatar: '/public/assets/candid.jpg'
  }
]

function ProfilePageContent() {
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData)
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)

  const handleProfileSave = (updatedProfile: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updatedProfile }))
    // In a real app, you would call your API here
    console.log('Profile updated:', updatedProfile)
  }

  const handleProfileEdit = () => {
    // Scroll to the form or focus on the first input
    console.log('Edit profile clicked')
  }

  const handleProfilePictureChange = (file: File) => {
    // In a real app, you would upload the file and update the profile
    console.log('Profile picture changed:', file.name)
  }

  const handleNotificationClick = (notification: NotificationItem) => {
    console.log('Notification clicked:', notification)
    // Handle notification routing based on type
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr_288px] gap-4">
        {/* Column 1: Profile Sidebar */}
        <div className="order-2 lg:order-1">
          <ProfileSidebar
            profile={profileData}
            onEdit={handleProfileEdit}
            onProfilePictureChange={handleProfilePictureChange}
          />
        </div>

        {/* Column 2: Main Content */}
        <div className="order-1 lg:order-2">
          <ClientOnly fallback={
            <div className="space-y-4 lg:space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 lg:p-6">
                  <Skeleton className="h-5 lg:h-6 w-32 lg:w-48 mb-3 lg:mb-4" />
                  <div className="space-y-3 lg:space-y-4">
                    <Skeleton className="h-8 lg:h-10 w-full" />
                    <Skeleton className="h-8 lg:h-10 w-full" />
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <Skeleton className="h-8 lg:h-10" />
                      <Skeleton className="h-8 lg:h-10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <ProfileDetailsForm
              profile={profileData}
              onSave={handleProfileSave}
            />
          </ClientOnly>
        </div>

        {/* Column 3: Notifications Panel (hidden on mobile) */}
        <div className="order-3 hidden lg:block lg:sticky lg:top-16 h-fit">
          <ClientOnly fallback={
            <div className="w-full lg:w-72 p-4 lg:p-6 border border-gray-200 rounded-lg">
              <Skeleton className="h-5 lg:h-6 w-28 lg:w-32 mb-3 lg:mb-4" />
              <div className="space-y-2 lg:space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-2 lg:space-x-3">
                    <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3 lg:h-4 w-3/4 mb-1 lg:mb-2" />
                      <Skeleton className="h-2 lg:h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <NotificationsPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />
          </ClientOnly>
        </div>
      </div>

      <ClientOnly>
        <FloatingNotification
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkAsRead}
        />
      </ClientOnly>
    </>
  )
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      

      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePageContent />
      </Suspense>
    </div>
  )
}

function ProfilePageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr_288px] gap-4">
      {/* Profile Sidebar Skeleton */}
      <div className="order-2 lg:order-1">
        <div className="w-full lg:w-72 p-4 lg:p-6 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center mb-4 lg:mb-6">
            <Skeleton className="w-24 h-24 lg:w-32 lg:h-32 rounded-full" />
            <Skeleton className="h-5 lg:h-6 w-32 lg:w-40 mt-3 lg:mt-4" />
          </div>
          <div className="space-y-3 lg:space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <Skeleton className="h-12 lg:h-16" />
              <Skeleton className="h-12 lg:h-16" />
            </div>
            <Skeleton className="h-12 lg:h-16" />
            <Skeleton className="h-16 lg:h-20" />
            <Skeleton className="h-8 lg:h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="order-1 lg:order-2 space-y-4 lg:space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 lg:p-6">
            <Skeleton className="h-5 lg:h-6 w-32 lg:w-48 mb-3 lg:mb-4" />
            <div className="space-y-3 lg:space-y-4">
              <Skeleton className="h-8 lg:h-10 w-full" />
              <Skeleton className="h-8 lg:h-10 w-full" />
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <Skeleton className="h-8 lg:h-10" />
                <Skeleton className="h-8 lg:h-10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Panel Skeleton */}
      <div className="order-3 hidden lg:block">
        <div className="w-full lg:w-72 p-4 lg:p-6 border border-gray-200 rounded-lg">
          <Skeleton className="h-5 lg:h-6 w-28 lg:w-32 mb-3 lg:mb-4" />
          <div className="space-y-2 lg:space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-2 lg:space-x-3">
                <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 lg:h-4 w-3/4 mb-1 lg:mb-2" />
                  <Skeleton className="h-2 lg:h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}