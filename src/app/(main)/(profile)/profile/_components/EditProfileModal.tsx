"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/auth.types";
import {
  Save,
  X,
  User as UserIcon,
  Heart,
  MapPin,
  Briefcase,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedData: Partial<User>) => Promise<void>;
  isLoading?: boolean;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading = false,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "",
        dob: user.dob || "",
        gender: user.gender,
        genderPreference: user.genderPreference,
        lookingFor: user.lookingFor,
        privacy: user.privacy,
        occupation: user.occupation || "",
        education: user.education,
        smoking: user.smoking,
        drinking: user.drinking,
        relationshipStatus: user.relationshipStatus,
        children: user.children,
        religion: user.religion || "",
        height: user.height && user.height >= 100 ? user.height : undefined,
        agePreferences: {
          min: user.agePreferences?.min || 18,
          max: user.agePreferences?.max || 99,
        },
        location: {
          address: user.location?.address || "",
          city: user.location?.city || "",
          country: user.location?.country || "",
        },
        socialLinks: {
          instagram: user.socialLinks?.instagram || "",
          facebook: user.socialLinks?.facebook || "",
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
        },
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (
    field: keyof User,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBioChange = (value: string) => {
    const charCount = value.length;

    if (charCount <= 150) {
      setFormData((prev: Partial<User>) => ({ ...prev, bio: value }));
    }
  };

  const getBioCharCount = () => {
    const bio = formData.bio || "";
    return bio.length;
  };

  const handleNestedInputChange = (
    parentField: keyof User,
    childField: string,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as Record<string, unknown>),
        [childField]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const bioCharCount = getBioCharCount();
      if (bioCharCount > 150) {
        toast.error("Bio must be 150 characters or less");
        return;
      }

      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (value === null || value === undefined || value === "")
            return false;

          if (key === "height" && typeof value === "number" && value < 100)
            return false;

          if (typeof value === "object" && !Array.isArray(value)) {
            return Object.values(value).some(
              (v) => v !== null && v !== undefined && v !== ""
            );
          }

          return true;
        })
      );

      await onSave(cleanedData);
      onClose();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[85rem] max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            Edit Your Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Make your profile shine! Update your information to help others get
            to know you better ✨
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-3">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Basic Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your essential details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-primary"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-primary"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-primary"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-primary"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-primary flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                About Me
              </Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => handleBioChange(e.target.value)}
                placeholder="Tell us about yourself... What makes you unique?"
                rows={4}
                className={`border-border focus:border-primary mb-3 focus:ring-primary/20 resize-none ${
                  getBioCharCount() > 150
                    ? "border-red-300 focus:border-red-400"
                    : ""
                }`}
              />
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-muted-foreground">
                  Share what makes you special ✨
                </span>
                <span
                  className={`font-medium ${
                    getBioCharCount() > 150
                      ? "text-red-500"
                      : getBioCharCount() > 130
                      ? "text-amber-500"
                      : "text-green-600"
                  }`}
                >
                  {getBioCharCount()}/150 characters
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="dob" className="text-sm font-medium text-primary">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={
                  formData.dob
                    ? new Date(formData.dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => handleInputChange("dob", e.target.value)}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3"
              />
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Dating Preferences
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your dating preferences and what you&apos;re looking for
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label
                  htmlFor="gender"
                  className="text-sm font-medium text-primary"
                >
                  Your Gender
                </Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="genderPreference"
                  className="text-sm font-medium text-primary"
                >
                  Looking For
                </Label>
                <Select
                  value={formData.genderPreference || ""}
                  onValueChange={(value) =>
                    handleInputChange("genderPreference", value)
                  }
                >
                  <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3">
                    <SelectValue placeholder="Select gender preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="both">Everyone</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label
                  htmlFor="lookingFor"
                  className="text-sm font-medium text-primary"
                >
                  Relationship Type
                </Label>
                <Select
                  value={formData.lookingFor || ""}
                  onValueChange={(value) =>
                    handleInputChange("lookingFor", value)
                  }
                >
                  <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3">
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendship">New Friends</SelectItem>
                    <SelectItem value="relationship">
                      Serious Relationship
                    </SelectItem>
                    <SelectItem value="casual">Casual Dating</SelectItem>
                    <SelectItem value="other">Something Else</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="privacy"
                  className="text-sm font-medium text-primary"
                >
                  Profile Privacy
                </Label>
                <Select
                  value={formData.privacy || ""}
                  onValueChange={(value) => handleInputChange("privacy", value)}
                >
                  <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20 mb-3">
                    <SelectValue placeholder="Select privacy setting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Profile</SelectItem>
                    <SelectItem value="private">Private Profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Personal Details
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your professional and lifestyle information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="occupation"
                    className="text-sm font-medium text-primary"
                  >
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ""}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    placeholder="What do you do for work?"
                    className="h-11 border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="education"
                    className="text-sm font-medium text-primary"
                  >
                    Education Level
                  </Label>
                  <Select
                    value={formData.education || ""}
                    onValueChange={(value) =>
                      handleInputChange("education", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelor">
                        Bachelor&apos;s Degree
                      </SelectItem>
                      <SelectItem value="master">
                        Master&apos;s Degree
                      </SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="height"
                    className="text-sm font-medium text-primary"
                  >
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "height",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    placeholder="Your height"
                    min="100"
                    max="250"
                    className="h-11 border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="children"
                    className="text-sm font-medium text-primary"
                  >
                    Children
                  </Label>
                  <Select
                    value={formData.children || ""}
                    onValueChange={(value) =>
                      handleInputChange("children", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="have_children">
                        Have Children
                      </SelectItem>
                      <SelectItem value="want_children">
                        Want Children
                      </SelectItem>
                      <SelectItem value="dont_want_children">
                        Don&apos;t Want Children
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="religion"
                    className="text-sm font-medium text-primary"
                  >
                    Religion
                  </Label>
                  <Input
                    id="religion"
                    value={formData.religion || ""}
                    onChange={(e) =>
                      handleInputChange("religion", e.target.value)
                    }
                    placeholder="Your religion or beliefs"
                    className="h-11 border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="smoking"
                    className="text-sm font-medium text-primary"
                  >
                    Smoking
                  </Label>
                  <Select
                    value={formData.smoking || ""}
                    onValueChange={(value) =>
                      handleInputChange("smoking", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="sometimes">Sometimes</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="drinking"
                    className="text-sm font-medium text-primary"
                  >
                    Drinking
                  </Label>
                  <Select
                    value={formData.drinking || ""}
                    onValueChange={(value) =>
                      handleInputChange("drinking", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="socially">Socially</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="relationshipStatus"
                    className="text-sm font-medium text-primary"
                  >
                    Relationship Status
                  </Label>
                  <Select
                    value={formData.relationshipStatus || ""}
                    onValueChange={(value) =>
                      handleInputChange("relationshipStatus", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">Location</h3>
                <p className="text-sm text-primary-500">Where you&apos;re based</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-primary"
                >
                  Full Address
                </Label>
                <Input
                  id="address"
                  value={formData.location?.address || ""}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "location",
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="Enter your complete address"
                  className="h-11 border-border focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-primary"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.location?.city || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "location",
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="Your city"
                    className="h-11 border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-primary"
                  >
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={formData.location?.country || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "location",
                        "country",
                        e.target.value
                      )
                    }
                    placeholder="Your country"
                    className="h-11 border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-6 gap-3 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="h-11 px-6 border-border hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || getBioCharCount() > 150}
            className={`h-11 px-6 transition-all duration-200 ${
              getBioCharCount() > 150
                ? "bg-muted cursor-not-allowed hover:bg-muted"
                : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading
              ? "Saving..."
              : getBioCharCount() > 150
              ? "Bio too long"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
