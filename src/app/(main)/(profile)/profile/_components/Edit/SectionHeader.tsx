import React from "react";
import { SectionHeaderProps } from "./types";

export default function SectionHeader({
  icon: Icon,
  title,
  description,
  iconClassName = "text-primary"
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className={`w-5 h-5 ${iconClassName}`} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}