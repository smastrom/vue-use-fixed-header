import { getHead } from './utils/head'

export default defineNuxtConfig({
   devtools: { enabled: false },
   app: {
      head: getHead(),
   },
   nitro: {
      preset: 'cloudflare-pages',
   },
   css: ['@/assets/global.css'],
})
