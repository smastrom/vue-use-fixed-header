import type { Ref, ComputedRef, CSSProperties } from 'vue'

export type MaybeTemplateRef = HTMLElement | null | Ref<HTMLElement | null>

export interface UseFixedHeaderOptions<T = any> {
   leaveDelta: number
   enterDelta: number
   root: MaybeTemplateRef
   enterStyles: CSSProperties
   leaveStyles: CSSProperties
   watch: (Ref<T> | ComputedRef<T> | null)[]
}
