<script setup lang="ts">
import { ref, unref, computed, type Ref } from 'vue'
import { useFixedHeader } from '../../src'

const props = defineProps<{
   watch: Ref<boolean>
}>()

const headerRef = ref<HTMLElement | null>(null)

useFixedHeader(headerRef, {
   watch: props.watch,
})

const position = computed(() => (props.watch.value ? 'relative' : 'fixed'))
</script>

<template>
   <div class="Wrapper">
      <header
         class="Header"
         ref="headerRef"
         :style="{
            position,
         }"
      />
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
}
</style>
