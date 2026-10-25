import {expect,it} from 'vitest';
import {joinText} from './displayHelper';
it('menggabungkan teks dan angka tanpa menampilkan null/undefined',()=>{
 expect(joinText('Ruang ',1,' · ',null,undefined,0)).toBe('Ruang 1 · 0');
 expect(joinText()).toBe('');
});
