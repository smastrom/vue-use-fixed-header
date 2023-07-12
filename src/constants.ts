import type { UseFixedHeaderOptions } from './types'

export const IDLE_SCROLL_FRAME_COUNT = 15

export const CAPTURE_DELTA_FRAME_COUNT = 10

export const DEFAULT_ENTER_DELTA = 0.5

export const DEFAULT_LEAVE_DELTA = 0.25

const easing = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const defaultOptions: UseFixedHeaderOptions = {
   enterDelta: DEFAULT_ENTER_DELTA,
   leaveDelta: DEFAULT_LEAVE_DELTA,
   root: null,
   enterStyles: {
      transition: `transform 0.3s ${easing} 0s`,
      transform: 'translateY(0px)',
   },
   leaveStyles: {
      transition: `transform 0.5s ${easing} 0s`,
      transform: 'translateY(-100%)',
   },
}
