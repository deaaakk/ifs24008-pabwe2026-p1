<script lang="ts">
 import { apiRequest } from '#helpers/apiHelper';
 let name=$state(''),email=$state(''),password=$state(''),class_name=$state(''),error=$state(''),success=$state(false),busy=$state(false);
 async function submit(e:SubmitEvent){e.preventDefault();busy=true;error='';try{await apiRequest('/auth/register',{method:'POST',body:JSON.stringify({name,email,password,class_name})});success=true;}catch(e){error=(e as Error).message;}finally{busy=false;}}
</script>
<section class="card auth-card"><h1>Daftar Akun</h1><p>Pendaftaran menghasilkan akun mahasiswa. Peran ketua kelas atau dosen ditetapkan oleh admin.</p>
{#if success}<p role="status">Pendaftaran berhasil. <a href="/auth/login">Login sekarang</a>.</p>{:else}
{#if error}<p class="error" role="alert">{error}</p>{/if}
<form onsubmit={submit}><label>Nama lengkap<input bind:value={name} required autocomplete="name"/></label><label>Email<input type="email" bind:value={email} required autocomplete="username"/></label><label>Kelas<input bind:value={class_name} placeholder="Contoh: IF A"/></label><label>Password<input type="password" minlength="8" maxlength="128" bind:value={password} required autocomplete="new-password"/></label><button disabled={busy}>{busy?'Menyimpan…':'Daftar'}</button></form>{/if}</section>
