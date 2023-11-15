<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useFixedHeader } from '../../src'

const props = defineProps<{
   watch: Ref<boolean>
}>()

const headerRef = ref<HTMLElement | null>(null)

const { styles } = useFixedHeader(headerRef, {
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
            ...styles,
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
../../src/useFixedHeader
