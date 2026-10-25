import { expect, it, vi } from 'vitest';
const request=vi.hoisted(()=>vi.fn().mockResolvedValue({}));
vi.mock('#helpers/apiHelper',()=>({apiRequest:request,API_URL:'http://localhost:3000'}));
import { api, todayISO } from './api';
it('memetakan operasi domain ke method, path, dan payload',async()=>{
 const room={name:'Lab',location:'A',capacity:5,facilities:''};
 const reservation={room_id:1,borrower_name:'Ani',purpose:'Uji',date:'2026-11-01',start_time:'09:00',end_time:'10:00'};
 await api.rooms();await api.createRoom(room);await api.updateRoom(1,room);await api.deleteRoom(1);await api.availability(1,'2026-11-01');await api.reservations();await api.reservations({status:'pending',date:''});await api.createReservation(reservation);await api.setStatus(2,'approved');await api.deleteReservation(2);
 expect(request.mock.calls).toEqual([
 ['/rooms'],['/rooms',{method:'POST',body:JSON.stringify(room)}],['/rooms/1',{method:'PUT',body:JSON.stringify(room)}],['/rooms/1',{method:'DELETE'}],['/rooms/1/availability?date=2026-11-01'],['/reservations'],['/reservations?status=pending'],['/reservations',{method:'POST',body:JSON.stringify(reservation)}],['/reservations/2/status',{method:'PATCH',body:'{"status":"approved"}'}],['/reservations/2',{method:'DELETE'}]
 ]);
 expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
