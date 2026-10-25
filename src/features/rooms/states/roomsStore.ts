import { writable } from 'svelte/store';
import { api, type Room } from '#lib/api';
export const roomsStore = writable<Room[]>([]);
export async function loadRooms() {
 const rooms = await api.rooms();
 roomsStore.set(rooms);
 return rooms;
}
