![npm](https://img.shields.io/npm/v/vue-use-fixed-header?color=46c119) ![dependency-count](https://img.shields.io/badge/dependencies-0-success) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/chrome.yml?branch=main&label=chrome) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/safari.yml?branch=main&label=safari) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/firefox.yml?branch=main&label=firefox)

# Vue Use Fixed Header

Turn your boring fixed header into a smart one with three lines of code.

<br />

**Demo:** [Website](https://vue-use-fixed-header.netlify.app/) — **Examples:** [Vue 3](https://stackblitz.com/edit/vitejs-vite-nc7ey2?file=index.html,src%2Fcomponents%2FPage.vue) - [Nuxt 3](https://stackblitz.com/edit/nuxt-starter-zbtjes?file=layouts%2Fdefault.vue)

<br />

## Features

-  **Dead simple** - Write three lines of code and you're done.
-  **Enjoyable defaults** - When scrolling down, the header is hidden, when scrolling up, the header is shown.
-  **Powerful** - Uses acceleration delta (scroll speed) for both hiding and showing instead of fixed thresholds.
-  **Intuitive** - Behaves as expected on page load, scroll restoration, hovering, dropdown navigation, top-reached and reduced motion.
-  **Smart** - Functionalities are automatically enabled/disabled if your header turns from fixed/sticky to something else or it is hidden at different viewports
-  **Flexible** - Works with any scrolling container and with your own styles

<br />

## Installation

```bash
pnpm add vue-use-fixed-header
```

Or:

```bash
yarn add vue-use-fixed-header
```

```bash
npm i vue-use-fixed-header
```

<br />

## Usage

Pass your header's template ref to `useFixedHeader`. Then apply the returned reactive styles. That's it.

```vue
<script setup>
import { ref } from 'vue'
import { useFixedHeader } from 'vue-use-fixed-header'

const headerRef = ref(null)

const { styles } = useFixedHeader(headerRef)
</script>

<template>
   <header class="Header" ref="headerRef" :style="styles">
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

All you have to do is to set `position: fixed` (or `sticky`) to your header. `useFixedHeader` will take care of the rest.

<br />

## Automatic behavior toggling

On resize, `useFixedHeader` checks your header's `position` and `display` properties to determine whether its functionalities should be enabled or not.

_Disabled_ means that no event listeners are attached and the returned styles match an empty object `{}`.

### Different viewports

Hence feel free to have code like this:

```css
.Header {
   position: fixed;
}

/* Will be disabled */
@media (max-width: 768px) {
   .Header {
      position: relative;
   }
}

/* Same */
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
const { styles, isEnter, isLeave } = useFixedHeader(headerRef, {
   /**
    *
    * Use `null` if content is scrolled by the window,
    * otherwise pass a custom scrolling container template ref */
   root: null,
   /**
    *
    * ref or computed to watch for automatic behavior toggling */
   watch: () => null,
   /**
    *
    * Minimum acceleration delta required to show the header.
    * An higher value means that the user has to scroll faster. */
   enterDelta: 0.5,
   /**
    *
    * Minimum acceleration delta required to hide the header */
   leaveDelta: 0.15,
   /**
    *
    * Whether to toggle `visibility: hidden` on leave.
    * Set this to `false` if you want to keep the header
    * visible. */
   toggleVisibility: true,
   /**
    *
    * Custom styles applied when scrolling up */
   enterStyles: {
      transition: `transform 0.3s ease-out`,
      transform: 'translateY(0px)',
   },
   /**
    *
    * Custom styles applied when scrolling down */
   leaveStyles: {
      transition: `transform 0.5s ease-out`,
      transform: 'translateY(-100%)',
   },
})
```

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
