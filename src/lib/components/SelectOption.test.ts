import {render,screen} from '@testing-library/svelte';
import {expect,it} from 'vitest';
import SelectOption from './SelectOption.svelte';
it('option memperbarui label tanpa mengganti nilai dan mendukung pilihan kosong',async()=>{
 const target=document.createElement('select');document.body.append(target);
 const view=render(SelectOption,{target,props:{value:1,label:'Lab A'}});
 expect(screen.getByRole('option')).toHaveValue('1');
 await view.rerender({value:1,label:'Lab A diperbarui'});
 expect(screen.getByRole('option')).toHaveTextContent('Lab A diperbarui');
 expect(screen.getByRole('option')).toHaveValue('1');
 await view.rerender({value:2,label:'Lab B'});
 expect(screen.getByRole('option')).toHaveValue('2');
 await view.rerender({value:null,label:'Pilih ruangan'});
 expect(screen.getByRole('option')).toHaveValue('');
 view.unmount();target.remove();
});
