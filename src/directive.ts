import { useFixedHeader } from './useFixedHeader'

import type { ObjectDirective } from 'vue'
import type { UseFixedHeaderOptions } from './types'

export const vFixed: ObjectDirective<HTMLElement, UseFixedHeaderOptions> = {
   mounted(el, binding) {
      console.log(el, binding.value)

      const { isVisible } = useFixedHeader(el, binding.value || {})

      console.log(isVisible)
   },
}
