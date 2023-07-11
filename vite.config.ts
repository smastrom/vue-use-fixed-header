import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'

export default defineConfig(({ mode }) => {
   if (mode === 'demo') return { plugins: [vue()] }

   return {
      build: {
         lib: {
            entry: 'src/useFixedHeader.ts',
            name: 'vue-use-fixed-header',
            fileName: 'index',
            formats: ['es', 'cjs'],
         },
         rollupOptions: {
            external: ['vue'],
            output: {
               globals: {
                  vue: 'Vue',
               },
            },
            plugins: [
               terser({
                  compress: {
                     drop_console: true,
                     defaults: true,
                     passes: 4,
                     ecma: 2020,
                  },
               }),
            ],
         },
      },
      plugins: [dts({ staticImport: true, insertTypesEntry: true }), vue()],
   }
})
