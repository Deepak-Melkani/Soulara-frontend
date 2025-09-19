import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { SocialLinksSectionProps } from "./types";
import SectionHeader from "./SectionHeader";

export default function SocialLinksSection({
  formData,
  onNestedFieldChange,
}: SocialLinksSectionProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <SectionHeader
        icon={Share}
        title="Social Links"
        description="Connect your social media profiles (optional)"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="instagram"
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Label>
            <Input
              id="instagram"
              value={formData.socialLinks?.instagram || ""}
              onChange={(e) =>
                onNestedFieldChange("socialLinks", "instagram", e.target.value)
              }
              placeholder="Your Instagram handle"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="facebook"
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Label>
            <Input
              id="facebook"
              value={formData.socialLinks?.facebook || ""}
              onChange={(e) =>
                onNestedFieldChange("socialLinks", "facebook", e.target.value)
              }
              placeholder="Your Facebook profile"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="twitter"
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Label>
            <Input
              id="twitter"
              value={formData.socialLinks?.twitter || ""}
              onChange={(e) =>
                onNestedFieldChange("socialLinks", "twitter", e.target.value)
              }
              placeholder="Your Twitter handle"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="linkedin"
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={formData.socialLinks?.linkedin || ""}
              onChange={(e) =>
                onNestedFieldChange("socialLinks", "linkedin", e.target.value)
              }
              placeholder="Your LinkedIn profile"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}