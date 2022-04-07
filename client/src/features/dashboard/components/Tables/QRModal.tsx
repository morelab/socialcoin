import QRCode from 'qrcode.react';
import { ContentModal } from '../../../../components/Overlay/ContentModal';

type QRModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  url: string;
};

export const QRModal = ({ open, setOpen, url }: QRModalProps) => {
  return (
    <ContentModal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex justify-center sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <QRCode size={256} value={url} />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base text-white font-mediumtext-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </ContentModal>
  );
};