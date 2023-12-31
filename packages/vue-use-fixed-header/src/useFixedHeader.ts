import {
   shallowRef,
   ref,
   unref,
   watch,
   computed,
   readonly,
   type ComputedRef,
   type CSSProperties as CSS,
} from 'vue'

import { useReducedMotion, isBrowser } from './utils'
import { TRANSITION_STYLES } from './constants'

import type { UseFixedHeaderOptions, MaybeTemplateRef } from './types'

enum State {
   READY,
   ENTER,
   LEAVE,
}

export function useFixedHeader(
   target: MaybeTemplateRef,
   options: Partial<UseFixedHeaderOptions> = {},
): {
   styles: Readonly<CSS>
   isLeave: Readonly<ComputedRef<boolean>>
   isEnter: Readonly<ComputedRef<boolean>>
} {
   // Config

   const { enterStyles, leaveStyles } = TRANSITION_STYLES

   const root = () => (options.root || options.root === null ? unref(options.root) : null)
   const transitionOpacity = () =>
      options.transitionOpacity === undefined ? false : unref(options.transitionOpacity)

   const isReduced = useReducedMotion()

   // State

   const internal = {
      resizeObserver: undefined as ResizeObserver | undefined,
      initResizeObserver: false,
      isListeningScroll: false,
      isHovering: false,
   }

   const styles = shallowRef<CSS>({})
   const state = ref<State>(State.READY)

   const setStyles = (newStyles: CSS) => (styles.value = newStyles)
   const removeStyles = () => (styles.value = {})
   const setState = (newState: State) => (state.value = newState)

   // Utils

   function getRoot() {
      const _root = root()
      if (_root != null) return _root

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

      const { position, display } = window.getComputedStyle(el)
      return (position === 'fixed' || position === 'sticky') && display !== 'none'
   }

   function getHeaderHeight() {
      const el = unref(target)
      if (!el) return 0

      let headerHeight = el.scrollHeight

      const { marginTop, marginBottom } = window.getComputedStyle(el)
      headerHeight += Number.parseFloat(marginTop) + Number.parseFloat(marginBottom)

      return headerHeight
   }

   // Callbacks

   /**
    * Resize observer is added wheter or not the header is fixed/sticky
    * as it is in charge of toggling scroll/pointer listeners if it
    * turns from fixed/sticky to something else and vice-versa.
    */
   function addResizeObserver() {
      internal.resizeObserver = new ResizeObserver(() => {
         // Skip the initial call
         if (!internal.initResizeObserver) return (internal.initResizeObserver = true)
         toggleListeners()
      })

      const root = getRoot()
      if (root) internal.resizeObserver.observe(root)
   }

   function onVisible() {
      if (state.value === State.ENTER) return

      removeTransitionListener()

      setStyles({
         ...enterStyles,
         ...(transitionOpacity() ? { opacity: 1 } : {}),
         visibility: '' as CSS['visibility'],
      })

      setState(State.ENTER)
   }

   function onHidden() {
      if (state.value === State.LEAVE) return

      setStyles({ ...leaveStyles, ...(transitionOpacity() ? { opacity: 0 } : {}) })

      setState(State.LEAVE)

      addTransitionListener()
   }

   // Transition Events

   function onTransitionEnd(e: TransitionEvent) {
      removeTransitionListener()

      if (!unref(target) || e.target !== unref(target) || e.propertyName !== 'transform') return

      /**
       * In some edge cases this might be called when the header
       * is visible, so we need to check the transform value.
       */
      const { transform } = window.getComputedStyle(unref(target)!)
      if (transform === 'matrix(1, 0, 0, 1, 0, 0)') return // translateY(0px)

      setStyles({
         ...leaveStyles,
         visibility: 'hidden',
      })
   }

   function addTransitionListener() {
      const el = unref(target)
      if (!el) return

      el.addEventListener('transitionend', onTransitionEnd as EventListener)
   }

   function removeTransitionListener() {
      const el = unref(target)
      if (!el) return

      el.removeEventListener('transitionend', onTransitionEnd as EventListener)
   }

   // Scroll Events

   function createScrollHandler() {
      let prevTop = isBrowser ? getScrollTop() : 0

      return () => {
         const scrollTop = getScrollTop()

         const isTopReached = scrollTop <= getHeaderHeight()
         const isScrollingUp = scrollTop < prevTop
         const isScrollingDown = scrollTop > prevTop

         const step = Math.abs(scrollTop - prevTop)

         if (isTopReached) return onVisible()
         if (step < 10) return

         if (!internal.isHovering) {
            if (isScrollingUp) {
               onVisible()
            } else if (isScrollingDown) {
               onHidden()
            }
         }

         prevTop = getScrollTop()
      }
   }

   const onScroll = createScrollHandler()

   function addScrollListener() {
      const root = getRoot()
      if (!root) return

      const scrollRoot = root === document.documentElement ? document : root

      scrollRoot.addEventListener('scroll', onScroll, { passive: true })
      internal.isListeningScroll = true
   }

   function removeScrollListener() {
      const root = getRoot()
      if (!root) return

      const scrollRoot = root === document.documentElement ? document : root

      scrollRoot.removeEventListener('scroll', onScroll)
      internal.isListeningScroll = false
   }

   // Pointer Events

   function onPointerMove(e: PointerEvent) {
      internal.isHovering = unref(target)?.contains(e.target as Node) ?? false
   }

   function addPointerListener() {
      document.addEventListener('pointermove', onPointerMove)
   }

   function removePointerListener() {
      document.removeEventListener('pointermove', onPointerMove)
   }

   // Listeners

   function toggleListeners() {
      const isValid = isFixed()

      if (internal.isListeningScroll) {
         // If the header is not anymore fixed or sticky
         if (!isValid) {
            removeListeners()
            removeStyles()
         }
         // If was not listening and now is fixed or sticky
      } else {
         if (isValid) {
            addScrollListener()
            addPointerListener()
         }
      }
   }

   function removeListeners() {
      removeScrollListener()
      removePointerListener()
   }

   isBrowser &&
      watch(
         () => [unref(target), getRoot(), isReduced.value, unref(options.watch)],
         ([headerEl, rootEl, isReduced], _, onCleanup) => {
            const shouldInit = !isReduced && headerEl && (rootEl || rootEl === null)

            if (shouldInit) {
               addResizeObserver()
               toggleListeners()
            }

            onCleanup(() => {
               removeListeners()
               removeStyles()
               internal.resizeObserver?.disconnect()
               internal.initResizeObserver = false
            })
         },
         { immediate: true, flush: 'post' },
      )

   return {
      styles: readonly(styles),
      isLeave: computed(() => state.value === State.LEAVE),
      isEnter: computed(() => state.value === State.ENTER),
   }
}
