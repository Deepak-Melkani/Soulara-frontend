"use client";

import * as React from "react";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  className = "",
}) => {
  return (
    <div
      className={`border-0 ${
        orientation === "horizontal" 
          ? "h-px w-full bg-gray-200" 
          : "w-px h-full bg-gray-200"
      } ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};