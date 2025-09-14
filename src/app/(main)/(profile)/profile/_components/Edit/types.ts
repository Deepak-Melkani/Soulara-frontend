import { User } from "@/types/auth.types";
import { LucideIcon } from "lucide-react";

// Form data type for the edit profile modal
export interface EditProfileFormData extends Partial<User> {
  agePreferences?: {
    min: number;
    max: number;
  };
  location?: {
    address: string;
    city: string;
    country: string;
  };
  socialLinks?: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

// Handler types for form interactions
export type FormFieldHandler = (
  field: keyof User,
  value: string | number | boolean | undefined
) => void;

export type NestedFieldHandler = (
  section: keyof EditProfileFormData,
  field: string,
  value: string | number
) => void;

export type AgeRangeHandler = (values: number[]) => void;

// Base props for all section components
export interface BaseSectionProps {
  formData: EditProfileFormData;
  onFieldChange: FormFieldHandler;
  onNestedFieldChange: NestedFieldHandler;
}

// Section header props
export interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

// Specific section props
export interface BasicInformationSectionProps extends BaseSectionProps {
  getBioCharCount: () => number;
}

export interface DatingPreferencesSectionProps extends BaseSectionProps {
  onAgeRangeChange: AgeRangeHandler;
}

export type PersonalDetailsSectionProps = BaseSectionProps;

export type LocationSectionProps = BaseSectionProps;