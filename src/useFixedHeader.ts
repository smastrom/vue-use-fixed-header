import {
   onBeforeUnmount,
   ref,
   unref,
   watch,
   nextTick,
   shallowReactive,
   computed,
   type CSSProperties,
} from 'vue'

import { mergeDefined, isSSR, isReducedMotion } from './utils'
import { CAPTURE_DELTA_FRAME_COUNT, defaultOptions } from './constants'

import type { UseFixedHeaderOptions, MaybeTemplateRef, UseFixedHeaderReturn } from './types'

enum State {
   READY = 'READY',
   ENTER = 'ENTER',
   LEAVE = 'LEAVE',
}

export function useFixedHeader(
   target: MaybeTemplateRef,
   options: UseFixedHeaderOptions = defaultOptions,
): UseFixedHeaderReturn {
   const mergedOptions = mergeDefined(defaultOptions, options)

   let resizeObserver: ResizeObserver | undefined = undefined

   let isListeningScroll = false
   let isHovering = false
   let isInstantRestoration = true

   // Internal state

   const styles = shallowReactive<CSSProperties>({})
   const state = ref<State>(State.READY)

   function setStyles(newStyles: CSSProperties) {
      Object.assign(styles, newStyles)
   }

   function removeStyles() {
      Object.keys(styles).forEach((key) => delete styles[key as keyof CSSProperties])
   }

   function setState(newState: State) {
      state.value = newState
   }

   // Target utils

   function getRoot() {
      if (isSSR) return null

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
    * Hides the header on page load before it has a chance to paint,
    * only if scroll restoration is instant.
    *
    * If not instant (smooth-scroll) 'isBelowHeader' will resolve
    * to false and the header will be visible until next scroll.
    */
   function onInstantScrollRestoration() {
      if (!mergedOptions.toggleVisibility) return
      if (!isInstantRestoration) return

      requestAnimationFrame(() => {
         const isBelowHeader = getScrollTop() > getHeaderHeight() * 1.2
         if (isBelowHeader) setStyles({ ...mergedOptions.leaveStyles, visibility: 'hidden' })
      })
      isInstantRestoration = false
   }

   function onVisible() {
      if (state.value === State.ENTER) return

      toggleTransitionListener(true)

      setStyles({
         ...mergedOptions.enterStyles,
         ...(mergedOptions.toggleVisibility ? { visibility: undefined } : {}),
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

      setStyles({ visibility: 'hidden' })
   }

   function toggleTransitionListener(isRemove = false) {
      if (!mergedOptions.toggleVisibility) return

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

      const scrollRoot = root === document.documentElement ? window : root
      const method = isRemove ? 'removeEventListener' : 'addEventListener'

      scrollRoot[method]('scroll', onScroll, { passive: true })

      isListeningScroll = !isRemove
   }

   // Pointer

   const setHover = () => (isHovering = true)
   const removeHover = () => (isHovering = false)

   function togglePointer(isRemove = false) {
      const method = isRemove ? 'removeEventListener' : 'addEventListener'

      unref(target)?.[method]('pointermove', setHover)
      unref(target)?.[method]('pointerleave', removeHover)
   }

   // Listeners

   function removeListeners() {
      toggleTransitionListener(true)
      toggleScroll(true)
      togglePointer(true)
   }

   function toggleListeners() {
      const isValid = isFixed()

      if (isListeningScroll) {
         // If the header is not anymore fixed or sticky
         if (!isValid) {
            removeListeners()
            nextTick(removeStyles)
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
      (targetEl, _, onCleanup) => {
         if (isSSR) return

         if (targetEl) {
            /**
             * Resize observer is added in any case as it is
             * in charge of toggling scroll/pointer listeners if the header
             * turns from fixed/sticky to something else and vice-versa.
             */
            addResizeObserver()
            if (!isFixed()) return

            /**
             * Immediately hides the header on page load, this has effect
             * only if scroll restoration is not smooth and toggleVisibility
             * is set to true.
             */
            onInstantScrollRestoration()

            /**
             * Start listening scroll events, it will hide the header
             * in case of smooth-scroll restoration.
             */
            toggleListeners()
         }

         onCleanup(_onCleanup)
      },
      { immediate: true, flush: 'post' },
   )

   watch(mergedOptions.watch, toggleListeners, { flush: 'post' })

   onBeforeUnmount(_onCleanup)

   return {
      styles,
      isLeave: computed(() => state.value === State.LEAVE),
      isEnter: computed(() => state.value === State.ENTER),
   }
}
