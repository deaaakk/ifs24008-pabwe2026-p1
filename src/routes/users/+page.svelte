<script lang="ts">
 import SelectOption from "../../lib/components/SelectOption.svelte";
 import { joinText } from "#helpers/displayHelper";
 import { onMount } from 'svelte';
 import { apiRequest } from '#helpers/apiHelper';
 import { isAdmin, user, roleLabels, type User, type Role } from '#features/auth/states/authStore';
 let users=$state<User[]>([]),error=$state(''),busy=$state(false);
 async function load(){try{users=await apiRequest<User[]>('/users');}catch(e){error=(e as Error).message;}}
 onMount(()=>{if($isAdmin)void load();});
 async function setRole(id:number,role:Role){busy=true;error='';try{await apiRequest(`/users/${id}/role`,{method:'PATCH',body:JSON.stringify({role})});}catch(e){error=(e as Error).message;}finally{await load();busy=false;}}
</script>
<h1>Kelola Pengguna</h1>
{#if !$isAdmin}<p class="error">Halaman ini khusus admin.</p>{:else}
<p>Tetapkan peran ketua kelas atau dosen setelah memverifikasi identitas pengguna.</p>{#if error}<p role="alert" class="error">{error}</p>{/if}
<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Email</th><th>Kelas</th><th>Peran</th></tr></thead><tbody>{#each users as u(u.id)}<tr><td>{u.name}</td><td>{u.email}</td><td>{u.class_name||'—'}</td><td><select aria-label={joinText('Peran ', u.name)} value={u.role} disabled={busy||u.id===$user?.id} onchange={(e)=>setRole(u.id,e.currentTarget.value as Role)}>{#each Object.entries(roleLabels) as [value,label]}<SelectOption {value} {label}/>{/each}</select></td></tr>{:else}<tr><td colspan="4">Belum ada pengguna.</td></tr>{/each}</tbody></table></div>{/if}
