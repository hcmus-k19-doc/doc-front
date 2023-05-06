import Swal, { SweetAlertIcon } from 'sweetalert2';

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
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      confirmButtonColor: options.confirmButtonColor,
      cancelButtonColor: options.cancelButtonColor,
    });
  };
};
