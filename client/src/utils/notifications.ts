import { toast, ToastOptions } from 'react-toastify';

const options: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notifyInfo = (error?: string) => {
  error = error || 'Something went wrong';
  toast.info(error, options);
};

export const notifySuccess = (error?: string) => {
  error = error || 'Something went wrong';
  toast.success(error, options);
};

export const notifyWarning = (error?: string) => {
  error = error || 'Something went wrong';
  toast.warn(error, options);
};

export const notifyError = (error?: string) => {
  error = error || 'Something went wrong';
  toast.error(error, options);
};