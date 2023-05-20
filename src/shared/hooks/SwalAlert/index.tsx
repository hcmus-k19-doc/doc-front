import Swal, { SweetAlertIcon } from 'sweetalert2';

import { PRIMARY_COLOR } from '../../../config/constant';

interface UseSweetAlertOptions {
  html: string;
  timer?: number;
  icon?: SweetAlertIcon;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

export const useSweetAlert = () => {
  return (options: UseSweetAlertOptions) => {
    return Swal.fire({
      icon: options.icon,
      html: options.html,
      timer: options.timer,
      showConfirmButton: options.showConfirmButton,
      showCancelButton: options.showCancelButton,
      confirmButtonText: options.confirmButtonText || 'OK',
      cancelButtonText: options.cancelButtonText,
      confirmButtonColor: options.confirmButtonColor || PRIMARY_COLOR,
      cancelButtonColor: options.cancelButtonColor,
    });
  };
};
