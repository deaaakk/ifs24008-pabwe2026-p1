import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from './apiHelper';
afterEach(() => vi.unstubAllGlobals());
describe('REST helper', () => {
 it('mengirim JSON dan mempertahankan header', async () => {
  const fn=vi.fn().mockResolvedValue(new Response(JSON.stringify({id:1})));
  vi.stubGlobal('fetch',fn);
  expect(await apiRequest('/rooms',{method:'POST',body:'{}',headers:{'X-Test':'yes'}})).toEqual({id:1});
  const headers=fn.mock.calls[0][1].headers;
  expect(headers.get('Content-Type')).toBe('application/json');
  expect(headers.get('X-Test')).toBe('yes');
 });
 it('membaca respons tanpa isi',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(null,{status:204})));
  expect(await apiRequest('/rooms/1',{method:'DELETE'})).toBeUndefined();
 });
 it('menampilkan error API',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{"error":"Bentrok"}',{status:409})));
  await expect(apiRequest('/reservations')).rejects.toThrow('Bentrok');
 });
 it('memakai pesan cadangan HTTP',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status:500})));
  await expect(apiRequest('/rooms')).rejects.toThrow('500');
 });
 it('meneruskan gangguan jaringan',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('Offline')));
  await expect(apiRequest('/rooms')).rejects.toThrow('Offline');
 });
 it('tidak memaksa JSON pada unggahan FormData',async()=>{
  const fn=vi.fn().mockResolvedValue(new Response('{}'));vi.stubGlobal('fetch',fn);
  await apiRequest('/upload',{method:'POST',body:new FormData()});
  expect(fn.mock.calls[0][1].headers.has('Content-Type')).toBe(false);
 });
});
it('respons bukan JSON memberi petunjuk koneksi',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('<html>404</html>')));await expect(apiRequest('/rooms')).rejects.toThrow('Respons API tidak valid');});
it('alamat API mengikuti environment development dan produksi',async()=>{
 for(const [dev,url,expected] of [[true,undefined,'http://localhost:3000'],[true,'http://api.test','http://api.test'],[false,'http://localhost:3000','']] as const){vi.stubEnv('DEV',dev);if(url===undefined)vi.stubEnv('VITE_API_URL',undefined);else vi.stubEnv('VITE_API_URL',url);vi.resetModules();const module=await import('./apiHelper');expect(module.API_URL).toBe(expected);}
 vi.unstubAllEnvs();
});
