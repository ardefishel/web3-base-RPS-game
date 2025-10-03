import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings about comments that Rollup cannot interpret
        if (warning.code === 'INVALID_ANNOTATION') {
          return;
        }
        warn(warning);
      }
    },
    // Increase memory and chunk size limits
    chunkSizeWarningLimit: 1500
  },
  define: {
    // Ensure proper environment variable handling
    global: 'globalThis',
  }
})

export default config
