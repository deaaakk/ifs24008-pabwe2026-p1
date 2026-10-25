<script lang="ts">
 import SelectOption from "../../../lib/components/SelectOption.svelte";
 import { joinText } from "#helpers/displayHelper";
 import { canReserve, user, ready } from "#features/auth/states/authStore";
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { api, todayISO, type Room } from '#lib/api';

	let rooms = $state<Room[]>([]);
	let form = $state({
		room_id: Number(page.url.searchParams.get('room')) || 0,
		borrower_name: '',
		purpose: '',
		date: todayISO(),
		start_time: '09:00',
		end_time: '10:00'
	});
	let booked = $state<{ start_time: string; end_time: string; borrower_name: string }[]>([]);
	let error = $state('');
	let saving = $state(false);

	onMount(async () => {
		try { rooms = await api.rooms(); } catch (e) { error = (e as Error).message; }
		if (!form.room_id && rooms.length) form.room_id = rooms[0].id;
	});

	// Muat jadwal terpakai setiap kali ruangan/tanggal berubah
	$effect(() => {
		const { room_id, date } = form;
		if (!room_id || !date) return;
		let current = true;
        booked = [];
        api.availability(room_id, date).then((r) => { if (current) { booked = r.booked; error = ''; } }).catch((e) => { if (current) error = 'Gagal memuat jadwal: ' + e.message; });
        return () => { current = false; };
	});

	async function submit(e: Event) {
		e.preventDefault();
		error = '';
		saving = true;
		try {
			const borrower = get(user);
            if (!borrower || !['ketua', 'dosen'].includes(borrower.role)) throw new Error('Hanya ketua kelas dan dosen dapat mengajukan reservasi');
            await api.createReservation({ ...form, borrower_name: borrower.name, room_id: Number(form.room_id) });
			await goto('/reservations');
		} catch (err) {
			error = (err as Error).message;
		} finally {
			saving = false;
		}
	}
</script>

{#if !$ready}<p>Memeriksa sesi…</p>{:else if !$canReserve}<section class="card"><h1>Akses Reservasi Dibatasi</h1><p>Pengajuan reservasi hanya dapat dilakukan oleh ketua kelas atau dosen.</p><a href="/">Kembali ke beranda</a></section>{:else}
<h1>Buat Reservasi</h1>
{#if error}<div class="error">{error}</div>{/if}

<form class="card" onsubmit={submit}>
	<label>Ruangan
		<select bind:value={form.room_id} required>
			{#each rooms as r}<SelectOption value={r.id} label={joinText(r.name, ' (kap. ', r.capacity, ')')}/>{/each}
		</select>
	</label>
	<div class="grid">
		<label>Tanggal <input type="date" bind:value={form.date} required /></label>
		<label>Jam mulai <input type="time" min="08:00" max="20:00" bind:value={form.start_time} required /></label>
		<label>Jam selesai <input type="time" min="08:00" max="20:00" bind:value={form.end_time} required /></label>
	</div>
	{#if booked.length}
		<p class="muted">Sudah terpakai pada tanggal ini: {booked.map((b) => `${b.start_time}-${b.end_time}`).join(', ')}</p>
	{:else}
		<p class="muted">Belum ada reservasi pada tanggal ini.</p>
	{/if}
	<label>Nama peminjam <input value={joinText($user?.name)} readonly /></label>
	<label>Keperluan <textarea rows="3" bind:value={form.purpose} required></textarea></label>
	<button type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Ajukan Reservasi'}</button>
</form>

{/if}
