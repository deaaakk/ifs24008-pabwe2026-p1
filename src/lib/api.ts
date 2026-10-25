import { apiRequest as request } from '#helpers/apiHelper';
export { API_URL } from '#helpers/apiHelper';

export interface Room {
	id: number;
	name: string;
	location: string;
	capacity: number;
	facilities: string;
}

export type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Reservation {
 user_id?: number | null;
	id: number;
	room_id: number;
	room_name: string;
	borrower_name: string;
	purpose: string;
	date: string;
	start_time: string;
	end_time: string;
	status: Status;
}

export const api = {
	rooms: () => request<Room[]>('/rooms'),
	createRoom: (b: Omit<Room, 'id'>) => request<Room>('/rooms', { method: 'POST', body: JSON.stringify(b) }),
	updateRoom: (id: number, b: Omit<Room, 'id'>) =>
		request<Room>(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
	deleteRoom: (id: number) => request<void>(`/rooms/${id}`, { method: 'DELETE' }),
	availability: (id: number, date: string) =>
		request<{ booked: { id: number; start_time: string; end_time: string; borrower_name: string }[] }>(
			`/rooms/${id}/availability?date=${date}`
		),
	reservations: (q: Record<string, string> = {}) => {
		const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v)).toString();
		return request<Reservation[]>(`/reservations${qs ? '?' + qs : ''}`);
	},
	createReservation: (b: Omit<Reservation, 'id' | 'room_name' | 'status'>) =>
		request<Reservation>('/reservations', { method: 'POST', body: JSON.stringify(b) }),
	setStatus: (id: number, status: Status) =>
		request<Reservation>(`/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
	deleteReservation: (id: number) => request<void>(`/reservations/${id}`, { method: 'DELETE' })
};

export const todayISO = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD zona lokal
