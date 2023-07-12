<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFixedHeader } from '../../src/useFixedHeader'

const props = defineProps<{
   enterDelta?: number
   leaveDelta?: number
   simulateScrollRestoration?: boolean
}>()

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

onBeforeMount(() => {
   if (!props.simulateScrollRestoration) return

   window.requestAnimationFrame(() => {
      if (!containerRef.value) throw new Error('containerRef is null')

      containerRef.value.scroll(0, window.innerHeight / 3)
   })
})

useFixedHeader(headerRef, {
   root: containerRef,
   enterDelta: props.enterDelta,
   leaveDelta: props.leaveDelta,
})
</script>

<template>
   <div class="Wrapper">
      <div class="Scroller" ref="containerRef">
         <div class="Container">
            <header class="Header" ref="headerRef" />
         </div>
      </div>
   </div>
</template>

<style scoped>
.Wrapper {
   height: 100vh;
   height: 100svh;
   background-color: red;
   display: flex;
   justify-content: center;
   align-items: center;
}

.Scroller {
   width: 500px;
   height: 500px;
   overflow-y: scroll;
   overflow-x: hidden;
   background: white;
}

.Container {
   height: 2000px;
}

.Header {
   width: 100%;
   top: 0;
   left: 0;
   height: 80px;
   background: green;
   position: sticky;
}
</style>
