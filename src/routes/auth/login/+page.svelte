<script lang="ts">
 import { goto } from '$app/navigation';
 import { user, login } from '#features/auth/states/authStore';
 let email=$state(''), password=$state(''), error=$state(''), busy=$state(false);
 async function submit(e:SubmitEvent){e.preventDefault();busy=true;error='';try{await login(email,password);await goto('/');}catch(e){error=(e as Error).message;}finally{busy=false;}}
</script>
<section class="card auth-card"><h1>Login</h1><p class="muted">Gunakan akun reservasi ruanganmu.</p>
{#if $user}<p>Kamu sudah login. <a href="/">Ke beranda</a></p>{:else}
{#if error}<p class="error" role="alert">{error}</p>{/if}
<form onsubmit={submit}><label>Email<input type="email" bind:value={email} autocomplete="username" required/></label><label>Password<input type="password" bind:value={password} autocomplete="current-password" required/></label><button disabled={busy}>{busy?'Memproses…':'Login'}</button></form><p>Belum punya akun? <a href="/auth/register">Daftar mahasiswa</a>.</p>{/if}</section>
