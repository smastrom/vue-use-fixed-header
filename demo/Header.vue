<script setup lang="ts">
import { ref } from 'vue'
import { useFixedHeader } from '../src/useFixedHeader'

const headerRef = ref<HTMLElement | null>(null)

useFixedHeader(headerRef, {
   leaveDelta: 0.5,
   enterDelta: 0.5,
})
</script>

<template>
   <div>
      <header class="Header" ref="headerRef">
         <div class="Nav">
            <h2 class="Global_Logo">Vufh</h2>
            <ul class="Nav_List">
               <li>
                  <a target="_blank" href="https://github.com/smastrom/vue-use-fixed-header">
                     GitHub
                  </a>
               </li>
               <li class="Nav_List_Hidden">
                  <a target="_blank" href="https://www.npmjs.com/package/vue-use-fixed-header"
                     >NPM</a
                  >
               </li>
               <li class="Nav_List_Hidden">
                  <a target="_blank" href="https://github.com/smastrom/vue-use-fixed-header">
                     Live Examples
                  </a>
               </li>
               <li>
                  <a
                     target="_blank"
                     class="Nav_List_Button"
                     href="https://github.com/smastrom/vue-use-fixed-header/blob/main/demo/Header.vue"
                  >
                     View Code
                  </a>
               </li>
            </ul>
         </div>
      </header>
   </div>
</template>

<style scoped>
.Header {
   display: flex;
   width: 100%;
   top: 0;
   left: 0;
   justify-content: center;
   position: fixed;
   z-index: 10;
}

.Nav {
   background-color: white;
   border-radius: 1rem;
   width: 1280px;
   max-width: 100%;
   height: 80px;
   margin: 2rem;
   padding: 1rem;
   display: flex;
   align-items: center;
   justify-content: space-between;
   box-shadow: var(--Shadow);
}

.Nav_List {
   display: flex;
   list-style: none;
   gap: 3rem;
}

.Nav_List a {
   color: var(--TextColor);
   text-decoration: none;
   transition: color 200ms ease-in-out;
}

.Nav_List a:hover {
   color: var(--AccentColor);
   text-decoration: none;
}

.Nav_List_Button {
   background-color: var(--AccentColor);
   color: var(--WhiteColor) !important;
   padding: 0.75rem 1rem;
   border-radius: 0.5rem;
   transition: opacity 200ms ease-in-out !important;
}

@media (hover: hover) {
   .Nav_List_Button:hover {
      opacity: 0.5;
   }
}

@media (max-width: 768px) {
   .Nav {
      margin: 1rem;
   }
   .Nav_List {
      gap: 2rem;
   }
   .Nav_List_Hidden {
      display: none;
   }
}
</style>
