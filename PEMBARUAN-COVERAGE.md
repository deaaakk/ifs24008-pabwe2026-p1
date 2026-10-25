# Pembaruan pengujian frontend

73 tes lulus, pemeriksaan Svelte 0 error dan 0 warning.

Hasil V8 pada versi yang disertakan:
- Statements: 100% (774/774)
- Branches: 87,97% (161/183)
- Functions: 100% (162/162)
- Lines: 100% (253/253)

Target 100% pada seluruh metrik BELUM tercapai. `bun run test:coverage` tetap keluar dengan kode 1 karena Branches di bawah 100%. Ini berbeda dari `bun run test`, yang tesnya lulus. Tidak ada threshold yang diturunkan atau file aplikasi yang dikecualikan untuk menaikkan angka.

Tambahan tes mencakup: pengaturan peran admin, larangan akses mahasiswa, perubahan profil, perubahan password berhasil/gagal, pendaftaran gagal, pemulihan sesi, logout berhasil/gagal, filter reservasi, pemilik reservasi, sesi berubah sebelum submit, perubahan ruangan/tanggal/jam, dan respons jadwal terlambat setelah halaman ditutup.

Sisa branch ada pada dashboard, daftar/form reservasi, layout, profil, dan pengguna. Pemeriksaan keluaran compiler menunjukkan banyak branch tambahan berasal dari fallback interpolasi teks (`nilai ?? ''`) dan sinkronisasi value option yang dihasilkan Svelte. Ada juga fallback nama pengguna pada form yang hanya ditampilkan bagi pengguna dengan hak reservasi. Coverage V8 mencatat kode hasil kompilasi tersebut; 100% baris tidak berarti semua branch terpenuhi. Laporan belum membuktikan keamanan atau kualitas aplikasi secara menyeluruh.

## Memasang tes pada proyek yang sudah berjalan

Tidak perlu mengganti .env, database, atau backend. Salin berkas berikut dari ZIP ke lokasi yang sama di frontend-mu (ganti berkas lama jika ditanya):

1. src/features/auth/coverage.test.ts (baru)
2. src/features/pages.test.ts
3. src/helpers/apiHelper.test.ts
4. src/routes/layout.test.ts

Kemudian jalankan dari folder frontend:

```powershell
bun run test
bun run test:coverage
Start-Process .\coverage\index.html
```

Paket ini juga berisi frontend lengkap bila ingin mengekstrak ke folder baru. Panduan awal ada di README.md. Hasil diuji di Linux; hasil lingkungan Windows dapat berbeda menurut versi Node, dependensi, dan sourcemap. Gunakan package-lock.json dan npm ci untuk versi dependensi yang konsisten.
