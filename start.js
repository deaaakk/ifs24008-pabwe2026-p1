const port = process.env.APP_PORT || process.env.PORT || '3005';

process.env.APP_PORT = port;
process.env.PORT = port;
process.env.APP_HOST = '0.0.0.0';
process.env.HOST = '0.0.0.0';

console.log(`[START] Host: 0.0.0.0 | Port: ${port}`);

try {
  await import('./build/index.js');
} catch (error) {
  console.error('[START] Aplikasi gagal dijalankan:', error);
  process.exit(1);
}