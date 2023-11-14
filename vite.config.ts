import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
   if (mode === 'demo') return { plugins: [vue()] }

   return {
      build: {
         lib: {
            entry: 'src/index.ts',
            name: 'vue-use-fixed-header',
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
         drop: ['console'],
      },
      plugins: [
         dts({
            rollupTypes: true,
         }),
         vue(),
      ],
   }
})
