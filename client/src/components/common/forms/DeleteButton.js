import React from 'react';

const DeleteButton = ({ content, clickHandler }) => {
  return (
    <button
      type="button"
      onClick={clickHandler}
      className="inline-flex justify-center py-2 px-4 border border-transparent w-full shadow-sm text-md font-medium
            rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 mb-3
            focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 transition"
    >
      {content}
    </button>
  );
};

export default DeleteButton;