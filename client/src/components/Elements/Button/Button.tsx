import React from 'react';

const variants = {
  submit: 'text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:ring-indigo-500',
  delete: 'text-white bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'submit',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex justify-center py-2 px-4 border border-transparent w-full shadow-sm text-md font-medium
              rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${variants[variant]} ${className}`}
        {...props}
      >
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';