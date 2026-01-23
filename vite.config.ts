import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load toàn bộ env (không prefix) để dùng cho define
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    /**
     * Alias dùng toàn project
     * Import kiểu: import { supabase } from "@/lib/supabaseClient";
     */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    /**
     * Inject env cho các lib cần process.env
     * (Gemini SDK, legacy libs…)
     */
    define: {
      'process.env': {
        GEMINI_API_KEY: JSON.stringify(env.GEMINI_API_KEY),
        API_KEY: JSON.stringify(env.GEMINI_API_KEY),
      },
    },

    /**
     * Build config an toàn cho Vercel
     */
    build: {
      sourcemap: false,
      outDir: 'dist',
    },
  };
});
