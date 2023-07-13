![npm](https://img.shields.io/npm/v/vue-use-fixed-header?color=46c119) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/tests.yml?branch=main&label=tests)
![dependency-count](https://img.shields.io/badge/dependency%20count-0-success)

# Vue Use Fixed Header

Turn your boring fixed header into a smart animated one.

<br />

**Demo:** [Website](https://vue-use-fixed-header.netlify.app/) — **Examples:** [Vue 3]() - [Nuxt 3]()

<br />

## Features

-  **Dead simple** - Call a function and you're done whether you're SSR'ing or not
-  **Lightweight** - 1kb without any dependency
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

Pass your header's template ref to `useFixedHeader`. Then style your header as you would normally do. That's it.

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

:warning: There's only **one rule** to respect: Do not manually apply the `visibility` property since it's handled internally for you.

<br />

## Automatic behavior toggling

### Different viewports

If at different viewports, your header is not fixed/sticky anymore or it is hidden, functionalities are automatically disabled and enabled again when needed.

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

Let's say for example your header in some pages is not supposed to be fixed/sticky and you're using some reactive logic to change its styles.

You can use the `watch` property of `useFixedHeader` to tell the composable to perform a check everytime that value changes and it will automatically toggle functionalities if needed.

```vue
<script setup>
const route = useRoute()

const headerRef = ref(null)

const isPricingPage = computed(() => route.name === 'Pricing')

useFixedHeader(headerRef, {
   watch: [isPricingPage], // Will perform a check everytime this value changes (route changes)
})
</script>

<template>
   <header ref="headerRef" :style="{ position: isPricingPage ? 'relative' : 'fixed' }">
      <!-- Your content -->
   </header>
</template>
```

You can pass as many values as you want to `watch` (note the array syntax).

<br />

## Customization

```ts
const { isVisible } = useFixedHeader(headerRef, {
   /**
    * Keep null if content is scrolled by the window,
    * otherwise pass a custom scrolling container template ref */
   root: null,
   /**
    * ref or computed values to watch for automatic behavior toggling */
   watch: [], // Default
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
