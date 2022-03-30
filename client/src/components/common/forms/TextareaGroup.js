import React from 'react';

const TextareaGroup = ({ label, forName, value, handleInputChange }) => {
  return (
    <div className="col-span-6">
      <label htmlFor={forName} className="block text-md font-medium text-gray-700 dark:text-gray-100">
        {label}
      </label>
      <textarea
        name={forName}
        id={forName}
        autoComplete={forName}
        value={value}
        onChange={handleInputChange}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-opacity-50 rounded-md"
      />
    </div>
  );
};

export default TextareaGroup;