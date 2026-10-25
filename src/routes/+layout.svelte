<script lang="ts">
 import { joinText } from "#helpers/displayHelper";
 import '../app.css';
 import { onMount } from 'svelte';
 import { Building2 } from 'lucide-svelte';
 import favicon from '#lib/assets/favicon.svg';
 import { page } from '$app/state';
 import { user, ready, isAdmin, canReserve, roleLabels, restoreSession, logout } from '#features/auth/states/authStore';
 import type { LayoutProps } from './$types';
 let { children }:LayoutProps=$props();
 let error=$state('');
 const authPage=$derived(page.url.pathname.startsWith('/auth/'));
 onMount(restoreSession);
 async function signOut(){try{await logout();}catch(e){error=(e as Error).message;}}
</script>
<svelte:head><link rel="icon" href={favicon}/><title>Reservasi Ruangan</title></svelte:head>
<nav aria-label="Navigasi utama" class="topnav">
 <strong><Building2 size={22}/> Reservasi Ruangan</strong>
 {#if $user}
  <a href="/">Beranda</a><a href="/reservations">Jadwal Reservasi</a>
  {#if $canReserve}<a href="/reservations/new">+ Buat Reservasi</a>{/if}
  {#if $isAdmin}<a href="/rooms">Kelola Ruangan</a><a href="/users">Kelola Pengguna</a>{/if}
  <a href="/profile">{joinText('Profil · ', roleLabels[$user.role])}</a><button class="small secondary" onclick={signOut}>Logout</button>
 {:else}<a href="/auth/login">Login</a><a href="/auth/register">Daftar</a>{/if}
</nav>
<main>
 {#if error}<p class="error" role="alert">{error}</p>{/if}
 {#if authPage}{@render children()}
 {:else if !$ready}<p>Memeriksa sesi…</p>
 {:else if !$user}<section class="card"><h1>Selamat datang</h1><p>Silakan login untuk melihat jadwal dan ruangan.</p><p>Reservasi hanya dapat diajukan oleh ketua kelas dan dosen.</p><a class="btn" href="/auth/login">Login</a></section>
 {:else}{@render children()}{/if}
</main>
