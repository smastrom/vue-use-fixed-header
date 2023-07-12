import type { Ref, CSSProperties } from 'vue'

export type MaybeTemplateRef = HTMLElement | null | Ref<HTMLElement | null>

export interface UseFixedHeaderOptions {
   leaveDelta: number
   enterDelta: number
   root: MaybeTemplateRef
   enterStyles: CSSProperties
   leaveStyles: CSSProperties
}
