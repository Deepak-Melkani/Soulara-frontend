import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User as UserIcon, Camera } from "lucide-react";
import { BasicInformationSectionProps } from "./types";
import SectionHeader from "./SectionHeader";

export default function BasicInformationSection({
  formData,
  onFieldChange,
  getBioCharCount,
}: BasicInformationSectionProps) {
  const handleBioChange = (value: string) => {
    if (value.length <= 150) {
      onFieldChange("bio", value);
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <SectionHeader
        icon={UserIcon}
        title="Basic Information"
        description="Your essential details"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-primary"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName || ""}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-primary"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName || ""}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="dob" className="text-sm font-medium text-primary">
              Date of Birth
              {formData.dob && (
                <span className="text-muted-foreground font-normal ml-2">
                  (Age: {calculateAge(formData.dob)})
                </span>
              )}
            </Label>
            <Input
              id="dob"
              type="date"
              value={formatDateForInput(formData.dob)}
              onChange={(e) => onFieldChange("dob", e.target.value)}
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                  .toISOString()
                  .split("T")[0]
              }
            />
            <p className="text-xs text-muted-foreground">
              You must be at least 18 years old
            </p>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-primary"
            >
              Gender
            </Label>
            <Select
              value={formData.gender || ""}
              onValueChange={(value) => onFieldChange("gender", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
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
            className={`border-border focus:border-primary focus:ring-primary/20 resize-none ${
              getBioCharCount() > 150
                ? "border-red-300 focus:border-red-400"
                : ""
            }`}
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Share what makes you special ✨
            </span>
            <span
              className={`font-medium ${
                getBioCharCount() > 150
                  ? "text-red-500"
                  : getBioCharCount() > 130
                  ? "text-amber-500"
                  : "text-muted-foreground"
              }`}
            >
              {getBioCharCount()}/150
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
