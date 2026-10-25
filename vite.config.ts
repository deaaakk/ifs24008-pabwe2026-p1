import adapterBun from '@sveltejs/adapter-bun';
import adapterNetlify from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), '');
 const port = Number(process.env.APP_PORT || env.APP_PORT) || 3005;
 const isNetlify = Boolean(process.env.NETLIFY);
 const adapter = isNetlify
  ? adapterNetlify()
  : adapterBun({ envPrefix: 'APP_', serverOptions: { port } });
 return {
  plugins: [sveltekit({ adapter, compilerOptions: { runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true } }), tailwindcss(), svelteTesting()],
  server: { port, strictPort: true }, preview: { port, strictPort: true },
  test: { include: ['src/**/*.test.ts'], environment: 'jsdom', setupFiles: ['./src/setupTests.ts'],
   coverage: { provider: 'v8', reporter: ['text','json','html','lcov'], include: ['src/**/*.{ts,svelte}'], exclude: ['src/**/*.d.ts','src/setupTests.ts','src/test-utils.ts','src/**/*.test.ts','src/**/*.test.svelte'], thresholds: { lines:100, branches:100, functions:100, statements:100 } }
  }
 };
});