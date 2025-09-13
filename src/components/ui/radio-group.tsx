"use client";

import * as React from "react";

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  className = "",
  children,
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`space-y-2 ${className}`} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  className = "",
  children,
}) => {
  const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext);
  const isSelected = groupValue === value;

  return (
    <label 
      htmlFor={id} 
      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all hover:bg-gray-50 ${
        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
      } ${className}`}
    >
      <input
        type="radio"
        id={id}
        value={value}
        checked={isSelected}
        onChange={() => onValueChange?.(value)}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 rounded-full border-2 transition-colors ${
          isSelected 
            ? 'border-primary-500 bg-primary-500' 
            : 'border-gray-300'
        }`}
      >
        {isSelected && (
          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
        )}
      </div>
      <div className="flex-1">{children}</div>
    </label>
  );
};