<script setup lang="ts">
import { onBeforeMount, ref, type CSSProperties } from 'vue'
import { useFixedHeader } from '../../src'

const props = defineProps<{
   enterDelta?: number
   leaveDelta?: number
   enterStyles?: CSSProperties
   leaveStyles?: CSSProperties
   simulateInstantRestoration?: boolean
}>()

const headerRef = ref<HTMLElement | null>(null)

onBeforeMount(() => {
   if (!props.simulateInstantRestoration) return

   window.requestAnimationFrame(() => {
      window.scroll(0, window.innerHeight / 3)
   })
})

const { styles } = useFixedHeader(headerRef, {
   enterDelta: props.enterDelta,
   leaveDelta: props.leaveDelta,
   enterStyles: props.enterStyles,
   leaveStyles: props.leaveStyles,
})
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
../../src/useFixedHeader
