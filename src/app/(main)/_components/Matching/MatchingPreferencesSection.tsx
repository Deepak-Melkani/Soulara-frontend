import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ClientOnly from '@/components/ClientOnly'

const MatchingPreferencesSection: React.FC = () => {
  const ageOptions = Array.from({length: 63}, (_, i) => i + 18)

  return (
    <section 
      className="bg-gradient-to-b from-background to-primary-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="matching-preferences-heading"
      role="region"
    >
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h2 
            id="matching-preferences-heading"
            className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Find Your Perfect Match
          </h2>
          <p 
            className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto"
            role="doc-subtitle"
          >
            Tell us about yourself and what you&apos;re looking for. Our algorithm will help you connect with compatible souls.
          </p>
        </header>

        <form 
          className="bg-card rounded-2xl shadow-xl p-8 border border-border"
          role="form"
          aria-label="Matching preferences form"
          noValidate
        >
          <ClientOnly fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <div className="space-y-3 min-w-0">
                <Label className="text-sm font-medium block">I am a</Label>
                <div className="h-11 w-full bg-muted rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-3 min-w-0">
                <Label className="text-sm font-medium block">Looking for</Label>
                <div className="h-11 w-full bg-muted rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-3 min-w-0">
                <Label className="text-sm font-medium block">Age from</Label>
                <div className="h-11 w-full bg-muted rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-3 min-w-0">
                <Label className="text-sm font-medium block">Age to</Label>
                <div className="h-11 w-full bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {/* I am */}
            <div className="space-y-3 min-w-0">
              <Label 
                htmlFor="gender-identity"
                className="text-sm font-medium block"
              >
                I am a
              </Label>
              <Select name="genderIdentity" aria-describedby="gender-identity-help">
                <SelectTrigger id="gender-identity" aria-required="true" className="h-11 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woman">Woman</SelectItem>
                  <SelectItem value="man">Man</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <span id="gender-identity-help" className="sr-only">
                Select how you identify gender-wise
              </span>
            </div>

            <div className="space-y-3 min-w-0">
              <Label 
                htmlFor="looking-for"
                className="text-sm font-medium block"
              >
                Looking for
              </Label>
              <Select name="lookingFor" aria-describedby="looking-for-help">
                <SelectTrigger id="looking-for" aria-required="true" className="h-11 w-full">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                </SelectContent>
              </Select>
              <span id="looking-for-help" className="sr-only">
                Select who you&apos;re interested in meeting
              </span>
            </div>

            <div className="space-y-3 min-w-0">
              <Label 
                htmlFor="age-from"
                className="text-sm font-medium block"
              >
                Age from
              </Label>
              <Select name="ageFrom" aria-describedby="age-from-help">
                <SelectTrigger id="age-from" aria-required="true" className="h-11 w-full">
                  <SelectValue placeholder="Select min age" />
                </SelectTrigger>
                <SelectContent>
                  {ageOptions.map(age => (
                    <SelectItem key={`from-${age}`} value={age.toString()}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span id="age-from-help" className="sr-only">
                Select the minimum age of people you&apos;d like to meet
              </span>
            </div>

            <div className="space-y-3 min-w-0">
              <Label 
                htmlFor="age-to"
                className="text-sm font-medium block"
              >
                Age to
              </Label>
              <Select name="ageTo" aria-describedby="age-to-help">
                <SelectTrigger id="age-to" aria-required="true" className="h-11 w-full">
                  <SelectValue placeholder="Select max age" />
                </SelectTrigger>
                <SelectContent>
                  {ageOptions.map(age => (
                    <SelectItem key={`to-${age}`} value={age.toString()}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span id="age-to-help" className="sr-only">
                Select the maximum age of people you&apos;d like to meet
              </span>
            </div>
          </div>
          </ClientOnly>

          {/* Location */}
          <div className="space-y-3 mt-6 pt-6 border-t border-border/30">
            <Label 
              htmlFor="location"
              className="text-sm font-medium block"
            >
              Location
            </Label>
            <Input 
              type="text" 
              id="location"
              name="location"
              placeholder="Enter your city or area"
              aria-required="true"
              aria-describedby="location-help"
              autoComplete="address-level2"
              className="h-11"
            />
            <span id="location-help" className="sr-only">
              Enter your city or area to find matches nearby
            </span>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-4 border-t border-border/50 text-center">
            <Button 
              type="submit"
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary-700 text-white font-sans shadow-sm px-8 py-4 text-lg font-semibold transition-all duration-300"
              aria-label="Submit matching preferences and start finding compatible matches"
            >
              Start Matching
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default MatchingPreferencesSection
