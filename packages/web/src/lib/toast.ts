import { toast } from 'sonner';

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 4000,
  });
};

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

export const toastInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  });
};

export const toastWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 4000,
  });
};
