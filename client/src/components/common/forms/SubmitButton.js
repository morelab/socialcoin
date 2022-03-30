import React from 'react';

const SubmitButton = ({ content }) => {
  return (
    <button
      type="submit"
      className="inline-flex justify-center py-2 px-4 border border-transparent w-full shadow-sm text-md font-medium
            rounded-md text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400
            focus:outline-none focus:ring-2 mb-3 focus:ring-offset-2 focus:ring-indigo-500 transition"
    >
      {content}
    </button>
  );
};

export default SubmitButton;