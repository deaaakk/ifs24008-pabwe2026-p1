import Swal from 'sweetalert2';
export async function showConfirmDialog(text: string) {
 const result = await Swal.fire({ title: 'Konfirmasi', text, icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, hapus', cancelButtonText: 'Batal' });
 return result.isConfirmed;
}
