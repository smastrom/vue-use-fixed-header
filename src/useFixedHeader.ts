import {
   onBeforeUnmount,
   shallowRef,
   ref,
   unref,
   watch,
   computed,
   readonly,
   type CSSProperties as CSS,
} from 'vue'

import { mergeDefined, isSSR, isReducedMotion } from './utils'
import { CAPTURE_DELTA_FRAME_COUNT, defaultOptions } from './constants'

import type { UseFixedHeaderOptions, MaybeTemplateRef, UseFixedHeaderReturn } from './types'

enum State {
   READY,
   ENTER,
   LEAVE,
}

export function useFixedHeader(
   target: MaybeTemplateRef,
   options: UseFixedHeaderOptions = defaultOptions,
): UseFixedHeaderReturn {
   const mergedOptions = mergeDefined(defaultOptions, options)

   let resizeObserver: ResizeObserver | undefined = undefined

   let isListeningScroll = false
   let isHovering = false

   // Internal state

   const styles = shallowRef<CSS>({})
   const state = ref<State>(State.READY)

   function setStyles(newStyles: CSS) {
      styles.value = newStyles
   }

   function removeStyles() {
      styles.value = {}
   }

   function setState(newState: State) {
      state.value = newState
   }

   // Target utils

   function getRoot() {
      const root = unref(mergedOptions.root)
      if (root != null) return root

      return document.documentElement
   }

   function getScrollTop() {
      const root = getRoot()
      if (!root) return 0

      return root.scrollTop
   }

   function isFixed() {
      const el = unref(target)
      if (!el) return false

      const { position, display } = getComputedStyle(el)
      return (position === 'fixed' || position === 'sticky') && display !== 'none'
   }

   function getHeaderHeight() {
      const el = unref(target)
      if (!el) return 0

      let headerHeight = el.scrollHeight

      const { marginTop, marginBottom } = getComputedStyle(el)
      headerHeight += parseFloat(marginTop) + parseFloat(marginBottom)

      return headerHeight
   }

   // Callbacks

   /**
    * Hides the header on page load before it has a chance to paint
    * if scroll restoration is instant. If not, applies the enter
    * styles immediately (without transitions).
    */
   function onScrollRestoration() {
      requestAnimationFrame(() => {
         const isInstant = getScrollTop() > getHeaderHeight() * 1.2 // Resolves to false if scroll is smooth

         if (isInstant) {
            setStyles({
               ...mergedOptions.leaveStyles,
               ...(mergedOptions.toggleVisibility ? { visibility: 'hidden' } : {}),
               transition: '', // We don't want transitions to play on page load...
            })
         } else {
            setStyles({ ...mergedOptions.enterStyles, transition: '' }) //...same here
         }
      })
   }

   function onVisible() {
      if (state.value === State.ENTER) return

      toggleTransitionListener(true)

      setStyles({
         ...mergedOptions.enterStyles,
         ...(mergedOptions.toggleVisibility ? { visibility: '' as CSS['visibility'] } : {}),
         ...(isReducedMotion() ? { transition: 'none' } : {}),
      })

      setState(State.ENTER)
   }

   function onHidden() {
      if (state.value === State.LEAVE) return

      setStyles({
         ...mergedOptions.leaveStyles,
         ...(isReducedMotion() ? { transition: 'none' } : {}),
      })

      setState(State.LEAVE)
      toggleTransitionListener()
   }

   // Transition

   function onTransitionEnd(e: TransitionEvent) {
      toggleTransitionListener(true)

      if (e.target !== unref(target)) return

      setStyles({
         ...mergedOptions.leaveStyles,
         ...(mergedOptions.toggleVisibility ? { visibility: 'hidden' } : {}),
      })
   }

   function toggleTransitionListener(isRemove = false) {
      const el = unref(target)
      if (!el) return

      const method = isRemove ? 'removeEventListener' : ('addEventListener' as const)
      el[method]('transitionend', onTransitionEnd as EventListener)
   }

   // Scroll

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

            if (frameCount === CAPTURE_DELTA_FRAME_COUNT) {
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
         const isTopReached = getScrollTop() <= getHeaderHeight()

         const isScrollingUp = getScrollTop() < prevTop
         const isScrollingDown = getScrollTop() > prevTop

         if (isTopReached) {
            onVisible()
         } else {
            if (!isHovering && prevTop > 0) {
               if (isScrollingUp && captureEnterDelta) {
                  captureEnterDelta = false

                  captureDelta((value) => {
                     if (value >= mergedOptions.enterDelta) {
                        onVisible()
                     }

                     captureEnterDelta = true
                  })
               } else if (isScrollingDown && captureLeaveDelta) {
                  captureLeaveDelta = false

                  captureDelta((value) => {
                     if (value >= mergedOptions.leaveDelta) {
                        onHidden()
                     }

                     captureLeaveDelta = true
                  })
               }
            }
         }

         prevTop = getScrollTop()
      }
   }

   const onScroll = createScrollHandler()

   function toggleScroll(isRemove = false) {
      const root = getRoot()
      if (!root) return

      const scrollRoot = root === document.documentElement ? document : root
      const method = isRemove ? 'removeEventListener' : 'addEventListener'

      scrollRoot[method]('scroll', onScroll, { passive: true })

      isListeningScroll = !isRemove
   }

   // Pointer

   function setPointer(e: PointerEvent) {
      isHovering = unref(target)?.contains(e.target as Node) ?? false
   }

   function togglePointer(isRemove = false) {
      const method = isRemove ? 'removeEventListener' : 'addEventListener'

      document[method]('pointermove', setPointer as EventListener)
   }

   // Listeners

   function removeListeners() {
      toggleScroll(true)
      togglePointer(true)
   }

   function toggleListeners() {
      const isValid = isFixed()

      if (isListeningScroll) {
         // If the header is not anymore fixed or sticky
         if (!isValid) {
            removeListeners()
            removeStyles()
         }
         // If was not listening and now is fixed or sticky
      } else {
         if (isValid) {
            toggleScroll()
            togglePointer()
         }
      }
   }

   function _onCleanup() {
      removeListeners()
      resizeObserver?.disconnect()
   }

   // Resize observer

   let skipInitial = true

   function addResizeObserver() {
      resizeObserver = new ResizeObserver(() => {
         if (skipInitial) return (skipInitial = false)
         toggleListeners()
      })

      const root = getRoot()
      if (root) resizeObserver.observe(root)
   }

   // Watchers

   /**
    * Using this instead of 'onMounted' allows to toggle resize
    * observer and scroll listener also in case the header is
    * somehow removed from the DOM and the parent component that
    * calls `useFixedHeader` is not unmounted.
    */
   watch(
      () => [unref(target), unref(mergedOptions.root)],
      ([targetEl, rootEl], _, onCleanup) => {
         const shouldInit = !isSSR && targetEl && (rootEl || rootEl === null)

         if (shouldInit) {
            /**
             * Resize observer is added in any case as it is
             * in charge of toggling scroll/pointer listeners if the header
             * turns from fixed/sticky to something else and vice-versa.
             */
            addResizeObserver()
            if (!isFixed()) return

            onScrollRestoration()
            toggleListeners()
         }

         onCleanup(_onCleanup)
      },
      { immediate: true, flush: 'post' },
   )

   watch(mergedOptions.watch, toggleListeners, { flush: 'post' })

   onBeforeUnmount(_onCleanup)

   return {
      styles: readonly(styles),
      isLeave: computed(() => state.value === State.LEAVE),
      isEnter: computed(() => state.value === State.ENTER),
   }
}
