import { writeFileSync } from 'node:fs';
const raw = process.env.BACKEND_URL;
if (!raw) throw new Error('Isi BACKEND_URL di environment Netlify dengan alamat HTTPS backend, lalu deploy ulang.');
const url = new URL(raw);
if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || ['localhost','127.0.0.1','::1','[::1]'].includes(url.hostname)) throw new Error('BACKEND_URL harus berupa origin HTTPS backend, tanpa /api, kredensial, atau query.');
writeFileSync('_redirects', `/api/*  ${url.origin}/api/:splat  200!\n`);
console.log('Proxy /api menuju backend terpisah telah disiapkan.');
