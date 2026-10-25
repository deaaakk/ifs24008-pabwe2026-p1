<script lang="ts">
 import { isAdmin } from "#features/auth/states/authStore";
 import { showConfirmDialog } from "#helpers/toolsHelper";
	import { onMount } from 'svelte';
 import { loadRooms } from '../states/roomsStore';
	import { api, type Room } from '#lib/api';

	const empty = { name: '', location: '', capacity: 10, facilities: '' };
	let rooms = $state<Room[]>([]);
	let form = $state({ ...empty });
	let editingId = $state<number | null>(null);
	let error = $state('');

	async function load() {
		try {
			rooms = await loadRooms();
		} catch (e) {
			error = (e as Error).message;
		}
	}
	onMount(load);

	async function submit(e: Event) {
		e.preventDefault();
		error = '';
		try {
			const body = { ...form, capacity: Number(form.capacity) };
			if (editingId) await api.updateRoom(editingId, body);
			else await api.createRoom(body);
			cancel();
			await load();
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function edit(r: Room) {
		editingId = r.id;
		form = { name: r.name, location: r.location, capacity: r.capacity, facilities: r.facilities };
	}
	function cancel() {
		editingId = null;
		form = { ...empty };
	}
	async function remove(r: Room) {
		if (!await showConfirmDialog(`Hapus ${r.name}? Semua reservasinya ikut terhapus.`)) return;
		try {
			await api.deleteRoom(r.id);
			await load();
		} catch (err) {
			error = (err as Error).message;
		}
	}
</script>

{#if !$isAdmin}<p class="error">Hanya admin yang dapat mengelola ruangan.</p>{:else}
<h1>Kelola Ruangan</h1>
{#if error}<div class="error">{error}</div>{/if}

<form class="card" onsubmit={submit} style="margin-bottom:1.5rem">
	<h3 style="margin-top:0">{editingId ? 'Ubah Ruangan' : 'Tambah Ruangan'}</h3>
	<div class="grid">
		<label>Nama <input bind:value={form.name} required /></label>
		<label>Lokasi <input bind:value={form.location} required /></label>
		<label>Kapasitas <input type="number" min="1" bind:value={form.capacity} required /></label>
		<label>Fasilitas <input bind:value={form.facilities} placeholder="Proyektor, AC, ..." /></label>
	</div>
	<div class="row">
		<button type="submit">{editingId ? 'Simpan' : 'Tambah'}</button>
		{#if editingId}<button type="button" class="secondary" onclick={cancel}>Batal</button>{/if}
	</div>
</form>

<div class="table-wrap">
	<table>
		<thead><tr><th>Nama</th><th>Lokasi</th><th>Kapasitas</th><th>Fasilitas</th><th></th></tr></thead>
		<tbody>
			{#each rooms as r (r.id)}
				<tr>
					<td>{r.name}</td><td>{r.location}</td><td>{r.capacity}</td><td>{r.facilities}</td>
					<td class="row">
						<button class="small secondary" onclick={() => edit(r)}>Ubah</button>
						<button class="small danger" onclick={() => remove(r)}>Hapus</button>
					</td>
				</tr>
			{:else}
				<tr><td colspan="5" class="muted">Belum ada ruangan.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

{/if}
