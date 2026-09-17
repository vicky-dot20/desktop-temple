import { defineConfig } from 'vite';
export default defineConfig({ base: './', build: { chunkSizeWarningLimit: 650,rollupOptions:{input:{temple:'index.html',onboarding:'onboarding.html'}} } });
