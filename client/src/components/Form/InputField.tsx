import React from 'react';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFiledProps = FieldWrapperPassThroughProps & React.InputHTMLAttributes<HTMLInputElement> & {
  isHalf?: boolean;
  className?: string;
};

export const InputField = (
  {
    type = 'text',
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
      <label htmlFor={name} className="block text-md font-medium text-gray-700 dark:text-gray-100">
        {label}
        <input
          type={type}
          name={name}
          id={name}
          autoComplete={name}
          value={value}
          onChange={onChange}
          required={required}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-opacity-50 rounded-md"
        />
      </label>
    </FieldWrapper>
  );
};