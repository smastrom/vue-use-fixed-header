import type { Ref } from 'vue'
import type { UseFixedHeaderOptions } from './types'

export const CAPTURE_DELTA_FRAME_COUNT = 10

export const DEFAULT_ENTER_DELTA = 0.5

export const DEFAULT_LEAVE_DELTA = 0.15

const easing = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const defaultOptions: Required<UseFixedHeaderOptions> = {
   enterDelta: DEFAULT_ENTER_DELTA,
   leaveDelta: DEFAULT_LEAVE_DELTA,
   root: null,
   toggleVisibility: true,
   enterStyles: {
      transition: `transform 0.3s ${easing} 0s`,
      transform: 'translateY(0px)',
   },
   leaveStyles: {
      transition: `transform 0.5s ${easing} 0s`,
      transform: 'translateY(-101%)',
   },
   watch: (() => null) as unknown as Ref<any>,
}
