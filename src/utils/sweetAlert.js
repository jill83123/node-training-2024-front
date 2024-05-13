import Swal from 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export function showToast({ icon, title }) {
  Swal.fire({
    icon,
    title,
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    width: 'auto',
    didOpen: (target) => {
      const toast = target;
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
}

export function showCheck({
  icon, title, text, onConfirm,
}) {
  Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}
