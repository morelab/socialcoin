type MiniTopbarProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
};

export const MiniTopbar = ({ children, className, title }: MiniTopbarProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow px-3 lg:rounded-lg flex items-center justify-between h-16 mb-5 ${className}`}>
      {title && <h1 className='text-3xl font-semibold text-gray-700 dark:text-white ml-2'>{title}</h1>}
      {children}
    </div>
  );
};