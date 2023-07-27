export function mergeDefined<T>(defaults: Required<T>, options: T): Required<T> {
   const result = { ...defaults }

   for (const key in options) {
      if (typeof options[key] !== 'undefined') {
         result[key] = options[key]
      }
   }

   return result as Required<T>
}

export const isSSR = typeof window === 'undefined'

export function isReducedMotion() {
   if (isSSR) return false

   return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
