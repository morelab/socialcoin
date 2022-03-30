import { toast } from 'react-toastify';

const options = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notifyInfo = (error) => {
  error = error || 'Something went wrong';
  toast.info(error, options);
};

export const notifySuccess = (error) => {
  error = error || 'Something went wrong';
  toast.success(error, options);
};

export const notifyWarning = (error) => {
  error = error || 'Something went wrong';
  toast.warn(error, options);
};

export const notifyError = (error) => {
  error = error || 'Something went wrong';
  toast.error(error, options);
};