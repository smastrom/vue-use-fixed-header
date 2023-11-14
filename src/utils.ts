import { onBeforeUnmount, onMounted, ref } from 'vue'

export const isSSR = typeof window === 'undefined'

export function useReducedMotion() {
   const isReduced = ref(false)

   const query = window.matchMedia('(prefers-reduced-motion: reduce)')

   const onMatch = () => (isReduced.value = query.matches)

   onMounted(() => {
      onMatch()
      query.addEventListener?.('change', onMatch)
   })

   onBeforeUnmount(() => {
      query.removeEventListener?.('change', onMatch)
   })

   return isReduced
}
