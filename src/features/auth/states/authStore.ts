import { writable, derived, get } from 'svelte/store';
import { apiRequest } from '#helpers/apiHelper';
export type Role = 'mahasiswa' | 'ketua' | 'dosen' | 'admin';
export interface User { id:number; name:string; email:string; role:Role; class_name:string; phone:string; }
export const roleLabels:Record<Role,string> = {mahasiswa:'Mahasiswa',ketua:'Ketua Kelas',dosen:'Dosen',admin:'Admin'};
export const user = writable<User|null>(null);
export const ready = writable(false);
export const canReserve = derived(user,u=>u?.role==='ketua'||u?.role==='dosen');
export const isAdmin = derived(user,u=>u?.role==='admin');
export async function restoreSession(){
 try { user.set(await apiRequest<User>('/users/me')); } catch { user.set(null); } finally { ready.set(true); }
}
export async function login(email:string,password:string){
 user.set(await apiRequest<User>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}));ready.set(true);
}
export async function logout(){await apiRequest('/auth/logout',{method:'POST'});user.set(null);}
export async function updateProfile(data:{name:string;class_name:string;phone:string}){
 user.set(await apiRequest<User>('/users/me',{method:'PUT',body:JSON.stringify(data)}));
}
export function owns(id:number|null|undefined){return id===get(user)?.id;}
