import { getHead } from './utils/head'

export default defineNuxtConfig({
   devtools: { enabled: false },
   app: {
      head: getHead(),
   },
   css: ['@/assets/global.css'],
})
