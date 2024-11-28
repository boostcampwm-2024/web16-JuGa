import { toast } from 'react-toastify';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  message: string;
  type: ToastType;
};

export default function Toast({ message, type }: ToastProps) {
  switch (type) {
    case 'success':
      return toast.success(message, { position: 'top-right', autoClose: 1000 });
    case 'error':
      return toast.error(message, { position: 'top-right', autoClose: 1000 });
    case 'warning':
      return toast.warning(message, { position: 'top-right', autoClose: 1000 });
    case 'info':
      return toast.info(message, { position: 'top-right', autoClose: 1000 });
    default:
      return null;
  }
}
