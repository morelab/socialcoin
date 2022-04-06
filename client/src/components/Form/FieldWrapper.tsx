import React from 'react';

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  description?: string;
};

export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, 'className' | 'children'>;

export const FieldWrapper = ({ label, className, children }: FieldWrapperProps) => {
  return (
    <div>
      {/* TODO check if this className breaks anything */}
      <label className={`block text-md font-medium text-gray-700 dark:text-gray-100 ${className}`}>
        {label}
        <div className="mt-1">{children}</div>
      </label>
    </div>
  );
};