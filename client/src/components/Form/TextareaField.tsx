import React from 'react';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFiledProps = FieldWrapperPassThroughProps & React.InputHTMLAttributes<HTMLTextAreaElement> & {
  isHalf?: boolean;
  className?: string;
};

export const TextareaField = (
  {
    label,
    name,
    value,
    onChange,
    isHalf = false,
    required = false
  }: InputFiledProps) => {
  const span = isHalf ? 'col-span-3' : 'col-span-6';

  return (
    <FieldWrapper label={label} className={span}>
      <textarea
        name={name}
        id={name}
        autoComplete={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-opacity-50 rounded-md"
      />
    </FieldWrapper>
  );
};