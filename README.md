# Frontend reservasi ruangan — SvelteKit

Jalankan backend dari ZIP backend lebih dahulu dan biarkan terminalnya terbuka. Ekstrak ZIP frontend ini, buka folder frontend di jendela VS Code lain, lalu Terminal > New Terminal. Perlu Node.js 22 atau lebih baru dan npm. Jalankan satu per satu di PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Salin .env hanya jika belum ada. Buka http://localhost:3005. Backend harus tetap berjalan pada http://localhost:3000. Folder frontend dan backend tidak perlu berada di lokasi yang sama.

Coba login lokal: ketua@del.ac.id dengan password Praktikum123! setelah seed backend. Akun mahasiswa tidak boleh mengajukan reservasi.

Untuk repository frontend tersendiri di Netlify: kosongkan Base directory (package.json ada di root repo), Build command npm run build:netlify, Publish directory build. Isi BACKEND_URL dengan origin HTTPS backend yang sudah aktif, tanpa /api. Jangan gunakan localhost. Panduan DEPLOY-ONLINE.md menjelaskan backend dan pemeriksaan online; bagian Base directory frontend pada panduan itu hanya berlaku jika memakai satu repo gabungan.
