<script lang="ts">
 import { page } from '$app/state';
</script>
<h1>{page.status}</h1>
<p>{page.error?.message ?? 'Halaman tidak ditemukan'}</p>
<a class="btn" href="/">Kembali ke beranda</a>
