import { defineConfig } from 'cypress'

export default defineConfig({
   video: false,
   viewportWidth: 1280,
   viewportHeight: 720,
   component: {
      devServer: {
         framework: 'vue',
         bundler: 'vite',
      },
   },
})
