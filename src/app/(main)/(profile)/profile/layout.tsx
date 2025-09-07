import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Profile Settings | Build to Bond',
  description: 'Manage your profile settings, preferences, and notifications',
}

interface ProfileLayoutProps {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {children}
      </div>
    </div>
  )
}
