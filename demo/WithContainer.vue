<script setup lang="ts">
import { ref } from 'vue'
import { useFixedHeader } from '../src/useFixedHeader'

import Header from './Header.vue'

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

useFixedHeader(headerRef, {
   root: containerRef,
})
</script>

<template>
   <div class="Scroll_Container" ref="containerRef">
      <div class="Container">
         <header class="Header_Wrapper" ref="headerRef">
            <div class="Header_Container">
               <h2 class="Global_Logo">Vufh</h2>

               <a
                  class="Header_Button"
                  href="https://github.com/smastrom/vue-use-fixed-header/blob/main/demo/WithContainer.vue"
               >
                  View Code
               </a>
            </div>
         </header>
      </div>
   </div>
</template>

<style scoped>
.Scroll_Container {
   height: 700px;
   max-width: 100%;
   width: 600px;
   margin: auto;
   overflow: auto;
   border-radius: 1.5rem;
   background-color: var(--WhiteColor);
   box-shadow: var(--Shadow);
}

.Container {
   height: 1800px;
   position: relative;
   background-color: var(--WhiteColor);
}

.Header_Wrapper {
   padding: 1rem;
   position: sticky;
   top: 0;
}

.Header_Container {
   justify-content: space-between;
   background-color: var(--AccentColor);
   display: flex;
   align-items: center;
   padding: 1rem;
   border-radius: 1rem;
}

.Header_Container .Global_Logo {
   color: var(--WhiteColor);
}

.Header_Button {
   color: var(--AccentColor);
   background-color: var(--WhiteColor);
   border-radius: 0.5rem;
   line-height: 1;
   padding: 0.65rem 1rem;
   text-decoration: none;
   transition: color 200ms ease-in-out, background-color 200ms ease-in-out;
}

@media (hover: hover) {
   .Header_Button:hover {
      color: var(--WhiteColor);
      background-color: var(--AccentColor);
   }
}
</style>
