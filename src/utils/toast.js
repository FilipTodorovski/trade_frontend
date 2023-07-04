import { toast } from 'react-toastify';

export const RunToast = (type, message) => {
  toast(message, {
    type,
    autoClose: 3000,
    hideProgressBar: true,
    closeonClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};
