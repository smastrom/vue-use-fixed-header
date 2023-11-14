import type { Ref } from 'vue'
import type { UseFixedHeaderOptions } from './types'

export const TRANSITION_STYLES = {
   enterStyles: {
      transition: `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0s, opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0s`,
      transform: 'translateY(0px)',
   },
   leaveStyles: {
      transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s, opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0s`,
      transform: 'translateY(-101%)',
   },
}

export const defaultOptions: UseFixedHeaderOptions = {
   root: null,
   watch: (() => null) as unknown as Ref<any>,
   transitionOpacity: false,
}
