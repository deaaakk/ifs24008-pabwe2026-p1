import { render, screen } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';
vi.mock('$app/state',()=>({page:{status:404,error:{message:'Halaman tidak ditemukan'}}}));
import ErrorPage from './routes/+error.svelte';
it('menampilkan halaman error beserta tautan kembali',()=>{
 render(ErrorPage);
 expect(screen.getByRole('heading',{name:'404'})).toBeInTheDocument();
 expect(screen.getByRole('link',{name:'Kembali ke beranda'})).toHaveAttribute('href','/');
});
