import {
   ref,
   onMounted,
   onBeforeUnmount,
   unref,
   toRefs,
   watch,
   type CSSProperties,
   type Ref,
} from 'vue'

type MaybeTemplateRef = HTMLElement | null | Ref<HTMLElement | null>

interface Options {
   leaveDelta: number
   enterDelta: number
   root: MaybeTemplateRef
   enterStyles: CSSProperties
   leaveStyles: CSSProperties
}

const easing = 'cubic-bezier(0.16, 1, 0.3, 1)'

const defaults: Options = {
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

export function useFixedHeader(target: MaybeTemplateRef, options: Partial<Options> = defaults) {
   const mergedOptions = { ...defaults, ...options }

   const isVisible = ref(false)

   // Utils

   function getRoot() {
      if (typeof window === 'undefined') return null
      const root = unref(mergedOptions.root)
      if (root != null && root !== document.documentElement) return root

      return document
   }

   function getScrollTop() {
      const root = getRoot()
      if (!root) return 0
      if (root === document) return document.documentElement.scrollTop

      return (root as HTMLElement).scrollTop
   }

   function getHeaderHeight(target: HTMLElement) {
      let headerHeight = target.scrollHeight

      const { marginTop, marginBottom } = getComputedStyle(target)
      headerHeight += parseFloat(marginTop) + parseFloat(marginBottom)

      return headerHeight
   }

   function setStyles(styles: CSSProperties) {
      const el = unref(target)
      if (!el) return

      Object.assign(el.style, styles)
   }

   function onScrollIdle(onIdle: () => void) {
      let rafId: DOMHighResTimeStamp | undefined = undefined
      let rafPrevY = getScrollTop()
      let frameCount = 0

      function checkIdle() {
         const rafNextY = getScrollTop()

         // If the scroll position has changed, reset and keep checking
         if (rafPrevY !== rafNextY) {
            frameCount = 0
            rafPrevY = rafNextY
            return requestAnimationFrame(checkIdle)
         }

         if (frameCount === 15) {
            onIdle()
            cancelAnimationFrame(rafId as DOMHighResTimeStamp)
         } else {
            frameCount++
            requestAnimationFrame(checkIdle)
         }
      }

      rafId = requestAnimationFrame(checkIdle)
   }

   // Scroll handler

   const onScroll = createScrollHandler()

   function createScrollHandler() {
      let captureEnterDelta = true
      let captureLeaveDelta = true

      let prevTop = 0

      function captureDelta(onCaptured: (value: number) => void) {
         let rafId: DOMHighResTimeStamp | undefined = undefined
         let frameCount = 0

         const startMs = performance.now()
         const startY = getScrollTop()

         function rafDelta() {
            const nextY = getScrollTop()

            if (frameCount === 10) {
               onCaptured(Math.abs(startY - nextY) / (performance.now() - startMs))
               cancelAnimationFrame(rafId as DOMHighResTimeStamp)
            } else {
               frameCount++
               requestAnimationFrame(rafDelta)
            }
         }

         rafId = requestAnimationFrame(rafDelta)
      }

      return () => {
         const el = unref(target)
         if (!el) return

         const isTopReached = getScrollTop() <= getHeaderHeight(el)
         const isScrollingUp = getScrollTop() < prevTop
         const isScrollingDown = getScrollTop() > prevTop

         if (isTopReached) {
            isVisible.value = true
         } else {
            if (prevTop !== 0) {
               if (isScrollingUp && captureEnterDelta) {
                  captureEnterDelta = false

                  captureDelta((value) => {
                     if (value >= mergedOptions.enterDelta) {
                        isVisible.value = true
                     }

                     captureEnterDelta = true
                  })
               } else if (isScrollingDown && captureLeaveDelta) {
                  captureLeaveDelta = false

                  captureDelta((value) => {
                     if (value >= mergedOptions.leaveDelta) {
                        isVisible.value = false
                     }

                     captureLeaveDelta = true
                  })
               }
            }
         }

         prevTop = getScrollTop()
      }
   }

   // Lifecycle

   onMounted(() => {
      const el = unref(target)
      if (!el) return

      if (getScrollTop() > getHeaderHeight(el) * 2) {
         setStyles({ ...mergedOptions.leaveStyles, visibility: 'hidden' })
      }

      onScrollIdle(() => {
         const root = getRoot()
         if (!root) return

         root.addEventListener('scroll', onScroll, { passive: true })
      })
   })

   onBeforeUnmount(() => {
      const root = getRoot()
      if (!root) return

      root.removeEventListener('scroll', onScroll)
   })

   // Watchers

   watch(
      isVisible,
      (_isVisible) => {
         if (_isVisible) {
            setStyles({ ...mergedOptions.enterStyles, visibility: 'visible' })
         } else {
            setStyles(mergedOptions.leaveStyles)

            const el = unref(target)
            if (!el) return

            el.ontransitionend = () => {
               if (!isVisible.value) setStyles({ visibility: 'hidden' })
               el.ontransitionend = null
            }
         }
      },
      { flush: 'sync' }
   )

   return { isVisible }
}
