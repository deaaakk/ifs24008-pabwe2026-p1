<script lang="ts">
 import SelectOption from "../../../lib/components/SelectOption.svelte";
 import { joinText } from "#helpers/displayHelper";
 import { isAdmin, canReserve, user } from "#features/auth/states/authStore";
 import { showConfirmDialog } from "#helpers/toolsHelper";
	import { onMount } from 'svelte';
	import { api, type Reservation, type Room, type Status } from '#lib/api';

	let items = $state<Reservation[]>([]);
	let rooms = $state<Room[]>([]);
	let filter = $state({ date: '', room_id: '', status: '' });
	let error = $state('');

	async function load() {
        error = '';
		try {
			items = await api.reservations(filter);
		} catch (e) {
			error = (e as Error).message;
		}
	}
	onMount(async () => {
		rooms = await api.rooms().catch(() => []);
		await load();
	});

	async function setStatus(id: number, s: Status) {
		try {
			await api.setStatus(id, s);
			await load();
		} catch (e) {
			error = (e as Error).message;
		}
	}
	async function remove(id: number) {
		if (!await showConfirmDialog('Hapus reservasi ini?')) return;
		try {
			await api.deleteReservation(id);
			await load();
		} catch (e) { error = (e as Error).message; }
	}
</script>

<h1>Daftar Reservasi</h1>
{#if error}<div class="error">{error}</div>{/if}

<div class="card row" style="margin-bottom:1rem;align-items:end">
	<label style="margin:0">Tanggal <input type="date" bind:value={filter.date} /></label>
	<label style="margin:0">Ruangan
		<select bind:value={filter.room_id}>
			<option value="">Semua</option>
			{#each rooms as r}<SelectOption value={r.id} label={r.name}/>{/each}
		</select>
	</label>
	<label style="margin:0">Status
		<select bind:value={filter.status}>
			<option value="">Semua</option>
			<option>pending</option><option>approved</option><option>rejected</option><option>cancelled</option>
		</select>
	</label>
	<button onclick={load}>Terapkan</button>
</div>

<div class="table-wrap">
	<table>
		<thead><tr><th>Tanggal</th><th>Jam</th><th>Ruangan</th><th>Peminjam</th><th>Keperluan</th><th>Status</th><th>Aksi</th></tr></thead>
		<tbody>
			{#each items as r (r.id)}
				<tr>
					<td>{r.date}</td>
					<td>{joinText(r.start_time, '–', r.end_time)}</td>
					<td>{r.room_name}</td>
					<td>{r.borrower_name}</td>
					<td>{r.purpose}</td>
					<td><span class={joinText('badge ', r.status)}>{r.status}</span></td>
					<td class="row">
						{#if $isAdmin && r.status === 'pending'}
							<button class="small ok" onclick={() => setStatus(r.id, 'approved')}>Setujui</button>
							<button class="small danger" onclick={() => setStatus(r.id, 'rejected')}>Tolak</button>
						{/if}
						{#if ($isAdmin || ($canReserve && r.user_id === $user?.id)) && (r.status === 'pending' || r.status === 'approved')}
							<button class="small secondary" onclick={() => setStatus(r.id, 'cancelled')}>Batalkan</button>
						{/if}
						{#if $isAdmin}<button class="small danger" onclick={() => remove(r.id)}>Hapus</button>{/if}
					</td>
				</tr>
			{:else}
				<tr><td colspan="7" class="muted">Tidak ada reservasi.</td></tr>
			{/each}
		</tbody>
	</table>
</div>
