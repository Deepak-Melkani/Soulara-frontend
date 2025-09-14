'use client';

import React, { useState } from 'react'
import { HeroSection } from './_components/Hero'
import MatchingPreferencesSection from './_components/Matching/MatchingPreferencesSection'
import HowItWorks from './_components/HowItWorks/HowItWorks'
import Features from './_components/Features'
import Testimonials from './_components/Testimonials'
import Pricing from './_components/Pricing'
import FAQ from './_components/FAQ'
import { FloatingCrons } from '@/components/feedback'
import OceanModel from '@/components/ocean/ocean-model'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  const [showOceanModal, setShowOceanModal] = useState(false);

  return (
    <>
    <main className="min-h-screen" role="main">
      <HeroSection />
      <MatchingPreferencesSection />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
    </main>
    {/* <FloatingFeedback /> */}
    <FloatingCrons />
    
    <div className="fixed bottom-4 right-4 z-40">
      <Button 
        onClick={() => setShowOceanModal(true)}
        className="bg-primary hover:bg-primary-400 text-white"
      >
        Take Personality Test
      </Button>
    </div>
    
    <OceanModel 
      isOpen={showOceanModal} 
      onClose={() => setShowOceanModal(false)} 
    />
    </>
  )
}

export default HomePage