![npm](https://img.shields.io/npm/v/vue-use-fixed-header?color=46c119) ![dependency-count](https://img.shields.io/badge/dependencies-0-success) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/chrome.yml?branch=main&label=chrome) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/safari.yml?branch=main&label=safari) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/firefox.yml?branch=main&label=firefox)

# Vue Use Fixed Header

Turn your boring fixed header into a smart one with one line of code.

<br />

**Demo:** [Website](https://vue-use-fixed-header.netlify.app/) — **Examples:** [Vue 3](https://stackblitz.com/edit/vitejs-vite-nc7ey2?file=index.html,src%2Fcomponents%2FPage.vue) - [Nuxt 3](https://stackblitz.com/edit/nuxt-starter-zbtjes?file=layouts%2Fdefault.vue)

<br />

## Features

-  **Dead simple** - Call a function and you're done whether you're SSR'ing or not
-  **Lightweight** - Just over 1kb without any dependency
-  **Enjoyable** - When scrolling down, the header is hidden, when scrolling up, the header is shown.
-  **Powerful** - Uses acceleration delta for both hiding and showing instead of fixed thresholds
-  **User-centric** - Behaves as your users expect on page load, scroll restoration, hovering, dropdown navigation, top reached and reduced motion.
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
   top: 0;
   /* Other styles... */
}
</style>
```

As long as your header position is set to fixed/sticky, it will behave as described in the [features](#features) section.

> :warning: There's only **one rule** to respect: Do not apply any _transition-related_ property since they're handled internally. See [below](#customization) how to customize them.

<br />

## Automatic behavior toggling

On resize, `useFixedHeader` checks your header's `position` and `display` properties to determine whether its functionalities should be enabled or not.

_Disabled_ means that the header will behave as you're not using the composable at all: no event listeners are attached and no additional styles are applied.

### Different viewports

If at different viewports your header position is not fixed/sticky (or it is hidden), functionalities are automatically toggled when needed.

So feel free to have code like this:

```css
.Header {
   position: fixed;
}

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

It will just work as expected.

### Advanced scenarios

Let's suppose your header in some pages is not fixed/sticky and you're using some reactive logic to style the `position` property.

You can pass a reactive source to the `watch` property of `useFixedHeader` to perform a check everytime the value changes:

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

`useFixedHeader` will automatically toggle functionalities when navigating to/from the _Pricing_ page.

> You can pass either a `ref` or a `computed` (without `.value`).

<br />

## Customization

```ts
useFixedHeader(headerRef, {
   /**
    * Use `null` if content is scrolled by the window,
    * otherwise pass a custom scrolling container template ref */
   root: null,
   /**
    * ref or computed to watch for automatic behavior toggling */
   watch: () => null,
   /**
    * Minimum acceleration delta required to show the header */
   enterDelta: 0.5,
   /**
    * Minimum acceleration delta required to hide the header */
   leaveDelta: 0.15,
   /**
    * Custom enter transition styles */
   enterStyles: {
      transition: `transform 0.3s ease-out`,
      transform: 'translateY(0px)',
   },
   /**
    * Custom leave transition styles */
   leaveStyles: {
      transition: `transform 0.5s ease-out`,
      transform: 'translateY(-100%)',
   },
})
```

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
