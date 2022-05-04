import { QuestionMarkCircleIcon } from '@heroicons/react/solid';

type EmptyTableNoticeProps = {
  title: string;
  children?: React.ReactNode;
};

export const EmptyTableNotice = ({ title, children }: EmptyTableNoticeProps) => {
  return (
    <div className='flex items-center justify-center'>
      <div className="mx-3 px-2 py-6 rounded-xl flex flex-col items-center justify-center gap-4 bg-gray-50 shadow dark:bg-gray-800 max-w-lg w-full">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-100 sm:mx-0 sm:h-16 sm:w-16">
          <QuestionMarkCircleIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-500" aria-hidden="true" />
        </div>
        <h1 className='text-xl dark:text-gray-100'>{title}</h1>
        {children}
      </div>
    </div>
  );
};