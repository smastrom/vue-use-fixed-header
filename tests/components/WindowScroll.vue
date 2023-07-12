<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFixedHeader } from '../../src/useFixedHeader'

const props = defineProps<{
   enterDelta?: number
   leaveDelta?: number
   simulateScrollRestoration?: boolean
}>()

const headerRef = ref<HTMLElement | null>(null)

onBeforeMount(() => {
   if (!props.simulateScrollRestoration) return

   window.requestAnimationFrame(() => {
      window.scroll(0, window.innerHeight / 3)
   })
})

useFixedHeader(headerRef, props)
</script>

<template>
   <div class="Wrapper">
      <header class="Header" ref="headerRef" />
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
</style>
