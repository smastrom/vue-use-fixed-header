import type { UseFixedHeaderOptions } from './types'

export const IDLE_SCROLL_FRAME_COUNT = 15

export const CAPTURE_DELTA_FRAME_COUNT = 10

const easing = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const defaultOptions: UseFixedHeaderOptions = {
   enterDelta: 0.5,
   leaveDelta: 0.25,
   root: null,
   enterStyles: {
      transition: `transform 300ms ${easing}`,
      transform: 'translateY(0px)',
      opacity: 1,
   },
   leaveStyles: {
      transition: `transform 600ms ${easing}, opacity 600ms ${easing}`,
      transform: 'translateY(-100%)',
      opacity: 0,
   },
}
