export interface ProfileData {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  preference: 'men' | 'women' | 'both' | 'Mard'
  bio: string
  profilePicture?: string
  email: string
  address: string
  phone: string
  agePreference: {
    min: number
    max: number
  }
  privacy: 'public' | 'private'
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
  }
  subscription: {
    currentPlan: 'free' | 'premium' | 'gold'
    active: boolean
  }
  lookingFor: 'casual' | 'relationship' | 'friendship' | 'other'
  stats: {
    crushes: number
    swipes: number
    matches: number
    views: number
  }
}

export interface NotificationItem {
  id: string
  type: 'system' | 'crush' | 'chat' | 'offers'
  title: string
  message: string
  timestamp: Date
  read: boolean
  avatar?: string
}

export type NotificationTab = 'system' | 'crush' | 'chat' | 'offers'
