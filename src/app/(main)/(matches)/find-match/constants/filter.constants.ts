import { FilterOptions } from '../types/filter.types';

export const FILTER_OPTIONS: FilterOptions = {
  educationOptions: [
    { value: 'high_school', label: 'High School' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' },
    { value: 'other', label: 'Other' },
  ],

  smokingOptions: [
    { value: 'never', label: 'Never' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'regularly', label: 'Regularly' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ],

  drinkingOptions: [
    { value: 'never', label: 'Never' },
    { value: 'socially', label: 'Socially' },
    { value: 'regularly', label: 'Regularly' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ],

  childrenOptions: [
    { value: 'none', label: 'No children' },
    { value: 'have_children', label: 'Have children' },
    { value: 'want_children', label: 'Want children' },
    { value: 'dont_want_children', label: "Don't want children" },
  ],

  relationshipStatusOptions: [
    { value: 'single', label: 'Single' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ],

  genderOptions: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ],

  genderPreferenceOptions: [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'both', label: 'Both' },
    { value: 'other', label: 'Other' },
  ],

  lookingForOptions: [
    { value: 'friendship', label: 'Friendship' },
    { value: 'relationship', label: 'Relationship' },
    { value: 'casual', label: 'Casual' },
    { value: 'other', label: 'Other' },
  ],

  lastActiveOptions: [
    { value: 1, label: 'Last 24 hours' },
    { value: 7, label: 'Last week' },
    { value: 30, label: 'Last month' },
  ],
};

export const DEFAULT_FILTERS = {
  ageRange: { min: 18, max: 99 },
  heightRange: { min: 140, max: 220 }, // in cm
  minProfileCompleteness: 0,
  lastActiveWithin: 30,
};