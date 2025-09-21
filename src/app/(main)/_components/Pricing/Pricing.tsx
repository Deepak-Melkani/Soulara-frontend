"use client"

import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface PricingTierProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isPopular?: boolean
  buttonText?: string
  onSelect?: () => void
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  buttonText = "Get Started",
  onSelect
}) => {
  return (
    <div className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${
      isPopular 
        ? 'border-primary-300 shadow-lg ring-2 ring-primary-200' 
        : 'border-border shadow-sm hover:border-primary-200'
    }`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl md:text-5xl font-bold text-foreground">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button 
        className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
          isPopular 
            ? 'bg-primary hover:bg-primary-600 text-white' 
            : 'bg-background border-2 border-primary text-primary hover:bg-primary hover:text-white'
        }`}
        onClick={onSelect}
      >
        {buttonText}
      </Button>
    </div>
  )
}

const Pricing: React.FC = () => {
  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for exploring soulmate connections",
      features: [
        "Basic profile creation",
        "5 daily matches",
        "Standard messaging",
        "Basic compatibility insights",
        "Community access"
      ],
      buttonText: "Start Free"
    },
    {
      name: "Premium Soul",
      price: "$19.99",
      period: "month",
      description: "Enhanced features for serious soul seekers",
      features: [
        "Everything in Free",
        "Unlimited matches & messaging",
        "Advanced aura compatibility",
        "See who viewed your profile",
        "Priority customer support",
        "Advanced filters & preferences",
        "Boost profile visibility"
      ],
      isPopular: true,
      buttonText: "Upgrade to Premium"
    },
    {
      name: "Cosmic Connection",
      price: "$49.99",
      period: "month",
      description: "Ultimate experience for finding your life partner",
      features: [
        "Everything in Premium Soul",
        "Personal relationship coaching",
        "Astrology compatibility reports",
        "Video date assistance",
        "Exclusive events & retreats",
        "Marriage preparation guidance",
        "Dedicated success manager",
        "Premium badge & verification"
      ],
      buttonText: "Go Cosmic"
    }
  ]

  return (
    <section 
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="text-center mb-16 lg:mb-20">
          <h2 
            id="pricing-heading"
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Choose Your Journey to Love
          </h2>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re just beginning to explore or ready to find your life partner, we have a plan that&apos;s perfect for your spiritual journey.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              period={tier.period}
              description={tier.description}
              features={tier.features}
              isPopular={tier.isPopular}
              buttonText={tier.buttonText}
              onSelect={() => {
                // Handle pricing tier selection
                console.log(`Selected ${tier.name} plan`)
              }}
            />
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 lg:mt-20 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground">30-Day Money-Back Guarantee</h3>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Not finding your soulmate connections? We&apos;re so confident in our platform that we offer a full refund within 30 days. Your journey to love should be risk-free.
            </p>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Have questions about our plans?{' '}
            <a href="#faq" className="text-primary hover:text-primary-600 underline font-medium">
              Check our FAQ below
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
