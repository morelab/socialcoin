import React from 'react';

const SelectGroup = ({ label, forName, options, value, handleInputChange }) => {
  return (
    <div className="col-span-6">
      <label htmlFor={forName} className="block text-md font-medium text-gray-700 dark:text-gray-100">
        {label}
      </label>
      <select
        id={forName}
        name={forName}
        autoComplete={forName}
        value={value}
        onChange={handleInputChange}
        // className="mt-1 block w-full py-2 px-3 border border-opacity-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-opacity-50 rounded-md"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
};

export default SelectGroup;