import { shallowRef, ref, unref, watch, computed, readonly, type CSSProperties as CSS } from 'vue'

import { isSSR, useReducedMotion } from './utils'
import { defaultOptions, TRANSITION_STYLES } from './constants'

import type { UseFixedHeaderOptions, MaybeTemplateRef } from './types'

enum State {
   READY,
   ENTER,
   LEAVE,
}

export function useFixedHeader(
   target: MaybeTemplateRef,
   options: Partial<UseFixedHeaderOptions> = {},
) {
   // Config

   const config = { ...defaultOptions, ...options }

   const { enterStyles, leaveStyles } = TRANSITION_STYLES

   let resizeObserver: ResizeObserver | undefined = undefined

   const isReduced = useReducedMotion()

   // Internal state

   const internals = {
      skipInitialObserverCb: true,
      isListeningScroll: false,
      isHovering: false,
      isMount: true,
   }

   const styles = shallowRef<CSS>({})
   const state = ref<State>(State.READY)

   const setStyles = (newStyles: CSS) => (styles.value = newStyles)
   const removeStyles = () => (styles.value = {})
   const setState = (newState: State) => (state.value = newState)

   // Utils

   function getRoot() {
      const root = unref(config.root)
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
         if (!internals.isMount || !isFixed()) return

         const isInstant = getScrollTop() > getHeaderHeight() * 1.2 // Resolves to false if scroll is smooth

         if (isInstant) {
            setStyles({
               transform: leaveStyles.transform,
               ...(config.transitionOpacity ? { opacity: 0 } : {}),
               visibility: 'hidden',
            })
         } else {
            setStyles({
               transform: enterStyles.transform,
               ...(config.transitionOpacity ? { opacity: 1 } : {}),
            })
         }

         internals.isMount = false
      })
   }

   /**
    * Resize observer is added wheter or not the header is fixed/sticky
    * as it is in charge of toggling scroll/pointer listeners if it
    * turns from fixed/sticky to something else and vice-versa.
    */
   function addResizeObserver() {
      resizeObserver = new ResizeObserver(() => {
         if (internals.skipInitialObserverCb) return (internals.skipInitialObserverCb = false)
         toggleListeners()
      })

      const root = getRoot()
      if (root) resizeObserver.observe(root)
   }

   function onVisible() {
      if (state.value === State.ENTER) return

      removeTransitionListener()

      setStyles({
         ...enterStyles,
         ...(config.transitionOpacity ? { opacity: 1 } : {}),
         visibility: '' as CSS['visibility'],
      })

      setState(State.ENTER)
   }

   function onHidden() {
      if (state.value === State.LEAVE) return

      setStyles({ ...leaveStyles, ...(config.transitionOpacity ? { opacity: 0 } : {}) })

      setState(State.LEAVE)

      addTransitionListener()
   }

   // Transition Events

   function onTransitionEnd(e: TransitionEvent) {
      removeTransitionListener()

      if (!unref(target) || e.target !== unref(target)) return

      /**
       * In some edge cases this might be called when the header
       * is visible, so we need to check the transform value.
       */
      const { transform } = window.getComputedStyle(unref(target)!)
      // console.log('transform@transitionEnd', transform)
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
      let prevTop = 0

      return () => {
         const scrollTop = getScrollTop()

         const isTopReached = scrollTop <= getHeaderHeight()
         const isScrollingUp = scrollTop < prevTop
         const isScrollingDown = scrollTop > prevTop

         const step = Math.abs(scrollTop - prevTop)

         if (isTopReached) return onVisible()
         if (step < 10) return

         if (!internals.isHovering) {
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
      internals.isListeningScroll = true
   }

   function removeScrollListener() {
      const root = getRoot()
      if (!root) return

      const scrollRoot = root === document.documentElement ? document : root

      scrollRoot.removeEventListener('scroll', onScroll)
      internals.isListeningScroll = false
   }

   // Pointer Events

   function onPointerMove(e: PointerEvent) {
      internals.isHovering = unref(target)?.contains(e.target as Node) ?? false
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

      if (internals.isListeningScroll) {
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

   watch(
      () => [unref(target), unref(config.root), isReduced.value, config.watch],
      ([headerEl, rootEl, isReduced], _, onCleanup) => {
         const shouldInit = !isReduced && !isSSR && headerEl && (rootEl || rootEl === null)

         if (shouldInit) {
            addResizeObserver()
            onScrollRestoration()
            toggleListeners()
         }

         onCleanup(() => {
            removeListeners()
            resizeObserver?.disconnect()
            removeStyles()
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
