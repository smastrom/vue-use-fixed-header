<script setup lang="ts">
import { ref } from 'vue'
import { useFixedHeader } from '../src/useFixedHeader'

const headerRef = ref<HTMLElement | null>(null)

const containerRef = ref<HTMLElement | null>(null)
const headerContainerRef = ref<HTMLElement | null>(null)

const { isVisible, delta } = useFixedHeader(headerRef, {
   hideDelta: 0.5,
   showDelta: 0.5,
})

useFixedHeader(headerContainerRef, {
   root: containerRef,
   hideDelta: 0.5,
   showDelta: 0.5,
})
</script>

<template>
   <div>
      <header class="Header" ref="headerRef">
         {{ delta }} {{ isVisible }}

         <h3>Vue 3 + Vite + TypeScript + Tailwind CSS</h3>
      </header>

      <div class="Page"></div>

      <div class="Container_Scroll" ref="containerRef">
         <div class="Container">
            <header class="HeaderContainer" ref="headerContainerRef">
               {{ delta }} {{ isVisible }}

               <h3>Vue 3 + Vite + TypeScript + Tailwind CSS</h3>
            </header>
         </div>
      </div>
   </div>
</template>

<style scoped>
.Header {
   background-color: white;
   width: 100%;
   height: 80px;
   top: 0;
   position: sticky;
}
.Page {
   height: 4000px;
}

.Container_Scroll {
   height: 400px;
   overflow: auto;
   background-color: white;
}

.Container {
   height: 1800px;
   position: relative;
   background-color: white;
}

.HeaderContainer {
   height: 60px;
   position: sticky;
   top: 0;
   background-color: aquamarine;
}
</style>
