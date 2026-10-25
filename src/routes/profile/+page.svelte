<script lang="ts">
 import { joinText } from "#helpers/displayHelper";
 import { onMount } from 'svelte';
 import { goto } from '$app/navigation';
 import { get } from 'svelte/store';
 import { user, roleLabels, updateProfile } from '#features/auth/states/authStore';
 import { apiRequest } from '#helpers/apiHelper';
 let name=$state(''),class_name=$state(''),phone=$state(''),current_password=$state(''),password=$state(''),message=$state(''),error=$state(''),busy=$state(false);
 onMount(()=>{const u=get(user);if(u){name=u.name;class_name=u.class_name;phone=u.phone;}});
 async function save(e:SubmitEvent){e.preventDefault();busy=true;error='';message='';try{await updateProfile({name,class_name,phone});message='Profil berhasil disimpan';}catch(e){error=(e as Error).message;}finally{busy=false;}}
 async function changePassword(e:SubmitEvent){e.preventDefault();busy=true;error='';try{await apiRequest('/users/me/password',{method:'PUT',body:JSON.stringify({current_password,password})});user.set(null);await goto('/auth/login');}catch(e){error=(e as Error).message;}finally{busy=false;}}
</script>
<h1>Profil Saya</h1>
{#if $user}<p><strong>{$user.name}</strong>{joinText(' · ', roleLabels[$user.role])}</p><p class="muted">Peran akun hanya dapat diubah oleh admin.</p>
{#if message}<p role="status">{message}</p>{/if}{#if error}<p role="alert" class="error">{error}</p>{/if}
<div class="grid"><form class="card" onsubmit={save}><h2>Data Profil</h2><label>Nama lengkap<input bind:value={name} required/></label><label>Email<input value={$user.email} readonly/></label><label>Kelas<input bind:value={class_name}/></label><label>Nomor telepon<input bind:value={phone} type="tel"/></label><button disabled={busy}>Simpan Profil</button></form>
<form class="card" onsubmit={changePassword}><h2>Ubah Password</h2><p>Setelah mengganti password, login kembali.</p><label>Password lama<input type="password" bind:value={current_password} required autocomplete="current-password"/></label><label>Password baru<input type="password" bind:value={password} minlength="8" maxlength="128" required autocomplete="new-password"/></label><button disabled={busy}>Ubah Password</button></form></div>{/if}
