import { expect, it, vi } from 'vitest';
vi.mock('sweetalert2',()=>({default:{fire:vi.fn()}}));
import Swal from 'sweetalert2';
import { showConfirmDialog } from './toolsHelper';
it('mengembalikan keputusan konfirmasi pengguna',async()=>{
 vi.mocked(Swal.fire).mockResolvedValueOnce({isConfirmed:true} as never).mockResolvedValueOnce({isConfirmed:false} as never);
 expect(await showConfirmDialog('Hapus?')).toBe(true);
 expect(await showConfirmDialog('Hapus?')).toBe(false);
});
