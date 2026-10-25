<script lang="ts">
 import { joinText } from "#helpers/displayHelper";
 import { canReserve, isAdmin } from "#features/auth/states/authStore";
	import { onMount } from 'svelte';
	import { api, todayISO, type Room, type Reservation } from '#lib/api';

	let rooms = $state<Room[]>([]);
	let today = $state<Reservation[]>([]);
	let error = $state('');
	let loading = $state(true);

	onMount(async () => {
		try {
			[rooms, today] = await Promise.all([api.rooms(), api.reservations({ date: todayISO() })]);
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	});

	const activeToday = (id: number) =>
		today.filter((r) => r.room_id === id && ['pending', 'approved'].includes(r.status));
</script>

<h1>Beranda</h1>
{#if error}<div class="error">{joinText('Gagal memuat data: ', error, '. Pastikan backend berjalan.')}</div>{/if}
{#if loading}
	<p class="muted">Memuat…</p>
{:else}
	<p class="muted">{joinText('Ketersediaan ruangan hari ini (', todayISO(), ')')}</p>
	<div class="grid">
		{#each rooms as room (room.id)}
			{@const used = activeToday(room.id)}
			<div class="card">
				<h3 style="margin-top:0">{room.name}</h3>
				<p class="muted">{joinText(room.location, ' · kapasitas ', room.capacity, ' orang')}</p>
				<p class="muted">{room.facilities || 'Tanpa fasilitas khusus'}</p>
				{#if used.length}
					<p style="color:var(--warn);font-size:.85rem">
						{joinText('Terpakai: ', used.map((u) => `${u.start_time}-${u.end_time}`).join(', '))}
					</p>
				{:else}
					<p style="color:var(--ok);font-size:.85rem">Kosong sepanjang hari</p>
				{/if}
				{#if $canReserve}<a class="btn" href={joinText('/reservations/new?room=', room.id)}>Reservasi</a>{:else}<p class="muted">Reservasi khusus ketua kelas dan dosen.</p>{/if}
			</div>
		{:else}
			<p>Belum ada ruangan. {#if $isAdmin}<a href="/rooms">Tambah ruangan</a>.{/if}</p>
		{/each}
	</div>
{/if}
