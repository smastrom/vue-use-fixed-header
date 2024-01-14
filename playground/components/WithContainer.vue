<script setup lang="ts">
import { ref } from 'vue'
import { useFixedHeader } from 'vue-use-fixed-header'

import Header from './Header.vue'

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

const { styles } = useFixedHeader(headerRef, {
   root: containerRef,
})
</script>

<template>
   <div class="Scroll_Container" ref="containerRef">
      <div class="Container">
         <header class="Header_Wrapper" ref="headerRef" :style="styles">
            <div class="Header_Container">
               <h2 class="Global_Logo">Vufh</h2>

               <a
                  target="_blank"
                  class="Header_Button"
                  href="https://github.com/smastrom/vue-use-fixed-header/blob/main/playground/components/WithContainer.vue"
               >
                  See Code
               </a>
            </div>
         </header>
         <div class="Content">
            <h2>Custom Scroll Container</h2>
            <p>Scroll this container to hide/show the header.</p>
         </div>
      </div>
   </div>
</template>

<style scoped>
.Scroll_Container {
   height: 700px;
   max-width: calc(100% - 4rem);
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
   padding: 0.875rem;
   position: sticky;
   top: 0;
}

.Header_Container {
   justify-content: space-between;
   background-color: var(--AccentColor);
   display: flex;
   align-items: center;
   padding: 0.875rem;
   border-radius: 1rem;
}

.Header_Container .Global_Logo {
   color: var(--WhiteColor);
}

.Header_Button {
   color: var(--AccentDarkColor);
   background-color: var(--WhiteColor);
   border-radius: 0.5rem;
   line-height: 1;
   padding: 0.65rem 1rem;
   text-decoration: none;
   transition:
      color 200ms ease-in-out,
      background-color 200ms ease-in-out;
}

@media (hover: hover) {
   .Header_Button:hover {
      background-color: var(--AccentLightColor);
   }
}

.Content {
   position: sticky;
   margin: auto;
   top: 40%;
   justify-content: center;
   align-items: center;
   color: var(--TextColor);
   display: flex;
   flex-direction: column;
   padding: 1rem;
   text-align: center;
}
</style>
