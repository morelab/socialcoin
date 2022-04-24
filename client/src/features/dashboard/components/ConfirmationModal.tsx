import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import { ContentModal } from '../../../components/Overlay/ContentModal';

type ConfirmationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  content: string;
  confirmHandler: () => void;
};

const ConfirmationModal = ({ open, setOpen, title, content, confirmHandler }: ConfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <ContentModal open={open} setOpen={setOpen} className='p-4 sm:px-8 sm:pt-8 sm:pb-6'>
      <div className="mb-3 flex flex-col items-center justify-center gap-4">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-100 sm:mx-0 sm:h-16 sm:w-16">
          <QuestionMarkCircleIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-500" aria-hidden="true" />
        </div>
        <h1 className='text-xl font-bold dark:text-gray-100'>{title}</h1>
        <p className='text-md text-center dark:text-gray-200'>
          {content}
        </p>
      </div>
      <div className="px-4 py-3 flex sm:px-6 flex-col sm:flex-row gap-4">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-gray-400 shadow-sm px-4 py-2
            text-base font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition sm:text-sm"
          onClick={() => {
            setOpen(false);
          }}
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={() => {
            confirmHandler();
            setOpen(false);
          }}
        >
          {t('common.confirm')}
        </button>
      </div>
    </ContentModal>
  );
};

export default ConfirmationModal;