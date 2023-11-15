import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const isFinalBundle = !process.argv.includes('--watch')

export default defineConfig({
   build: {
      emptyOutDir: isFinalBundle,
      target: 'es2015',
      lib: {
         entry: 'src/index.ts',
         fileName: 'index',
         formats: ['es'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
      },
   },
   esbuild: {
      drop: isFinalBundle ? ['console'] : [],
   },
   plugins: [
      dts({
         rollupTypes: true,
      }),
      vue(),
   ],
})
