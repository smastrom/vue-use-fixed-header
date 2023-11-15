<script setup lang="ts">
import { ref } from 'vue'
import { useFixedHeader } from '../../src'

const headerRef = ref<HTMLElement | null>(null)

const { styles } = useFixedHeader(headerRef)
</script>

<template>
   <div class="Wrapper">
      <header class="Header" ref="headerRef" :style="styles" />
   </div>
</template>

<style scoped>
.Wrapper {
   height: 2000px;
   display: flex;
}
.Header {
   width: 100%;
   top: 0;
   left: 0;
   height: 80px;
   background: red;
   position: fixed;
}

/** Used in resize.cy.ts */
@media (max-width: 768px) {
   .Header {
      position: relative;
   }
}

@media (max-width: 375px) {
   .Header {
      display: none;
   }
}
</style>
