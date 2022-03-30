import React from 'react';

const InputGroup = ({ label, forName, type, value, handleInputChange, isHalf = false, required = false }) => {
  const span = isHalf ? 'col-span-3' : 'col-span-6';

  return (
    <div className={span}>
      <label htmlFor={forName} className="block text-md font-medium text-gray-700 dark:text-gray-100">
        {label}
      </label>
      <input
        type={type}
        name={forName}
        id={forName}
        autoComplete={forName}
        value={value}
        onChange={handleInputChange}
        required={required}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-opacity-50 rounded-md"
      />
    </div>
  );
};

export default InputGroup;