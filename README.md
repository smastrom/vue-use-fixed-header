![npm](https://img.shields.io/npm/v/vue-use-fixed-header?color=46c119) ![dependency-count](https://img.shields.io/badge/dependencies-0-success) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/chrome.yml?branch=main&label=chrome) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/safari.yml?branch=main&label=safari) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/firefox.yml?branch=main&label=firefox)

# Vue Use Fixed Header

Turn your boring fixed header into a smart one.

<br />

**Demo:** [Website](https://vue-use-fixed-header.netlify.app/) — **Examples:** [Vue 3](https://stackblitz.com/edit/vitejs-vite-nc7ey2?file=index.html,src%2Fcomponents%2FPage.vue) - [Nuxt 3](https://stackblitz.com/edit/nuxt-starter-zbtjes?file=layouts%2Fdefault.vue)

<br />

## Features

-  **Dead simple** - Call a function and you're done whether you're SSR'ing or not
-  **Lightweight** - Just over 1kb without dependencies
-  **Powerful** - Uses acceleration delta for both hiding and showing instead of fixed thresholds
-  **Enjoyable** - When scrolling down, the header is hidden, when scrolling up, the header is shown.
-  **User-centric** - Behaves as your users expect on page load, different styles of scroll restoration and on top reached
-  **Smart** - Functionalities are automatically enabled/disabled if your header turns from fixed/sticky to something else or it is hidden at different viewports
-  **Flexible** - Works with any scrolling container and with your own transition styles

<br />

## Installation

```bash
pnpm add vue-use-fixed-header
```

<br />

## Usage

Pass your header's template ref to `useFixedHeader`. Then style it as you normally would. That's it.

```vue
<script setup>
import { ref } from 'vue'
import { useFixedHeader } from 'vue-use-fixed-header'

const headerRef = ref(null)

useFixedHeader(headerRef)
</script>

<template>
   <header class="Header" ref="headerRef">
      <!-- Your content -->
   </header>
</template>

<style scoped>
.Header {
   position: fixed; /* or sticky */
   top: 0; /* or whatever */
   /* Other styles... */
}
</style>
```

:warning: There's only **one rule** to respect: Do not apply any _visibility_ or _transition-related_ property since it's handled for you.

> See [below](#customization) how to customize transitions.

<br />

## Automatic behavior toggling

### Different viewports

If at different viewports your header is not fixed/sticky anymore (or it is hidden), functionalities are automatically disabled and enabled again if needed.

So feel free to have code like this:

```css
@media (max-width: 768px) {
   .Header {
      position: relative;
   }
}

@media (max-width: 375px) {
   .Header {
      display: none;
   }
}
```

It will just work.

### Advanced scenarios

Let's say your header in some pages is not supposed to be fixed/sticky and you're using some reactive logic to change its styles.

You can use the `watch` property of `useFixedHeader` to tell the composable to perform a check everytime that value changes and it will automatically toggle functionalities if necessary.

```vue
<script setup>
const route = useRoute()

const headerRef = ref(null)

const isPricingPage = computed(() => route.name === 'Pricing')

useFixedHeader(headerRef, {
   watch: isPricingPage, // Will perform a check everytime the value changes
})
</script>

<template>
   <header ref="headerRef" :style="{ position: isPricingPage ? 'relative' : 'fixed' }">
      <!-- Your content -->
   </header>
</template>
```

You can pass either a `ref` or a `computed` (without `.value`).

<br />

## Customization

```ts
const isVisible = useFixedHeader(headerRef, {
   /**
    * Use `null` if content is scrolled by the window,
    * otherwise pass a custom scrolling container template ref */
   root: null, // Default
   /**
    * ref or computed to watch for automatic behavior toggling */
   watch: () => null, // Default
   /**
    * Minimum acceleration delta required to show the header */
   enterDelta: 0.5, // Default
   /**
    * Minimum acceleration delta required to hide the header */
   leaveDelta: 0.15, // Default
   /**
    * Custom enter transition styles */
   enterStyles: {
      transition: `transform 0.3s ease-out`,
      transform: 'translateY(0px)',
      opacity: 1,
   },
   /**
    * Custom leave transition styles */
   leaveStyles: {
      transition: `transform 0.5s ease-out, opacity 0.5s ease-out`,
      transform: 'translateY(-100%)',
      opacity: 0,
   },
})
```

<br />

## Accessibility - Reduced Motion

This is not done for you and must be implemented manually using the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
   .Header {
      transition-duration: 0s;
      transition-delay: 0s;
   }
}
```

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
