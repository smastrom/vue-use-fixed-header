![npm](https://img.shields.io/npm/v/vue-use-fixed-header?color=46c119) ![dependency-count](https://img.shields.io/badge/dependencies-0-success) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/chrome-tests.yml?branch=main&label=chrome) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/firefox-tests.yml?branch=main&label=firefox)

# Vue Use Fixed Header

Turn your boring fixed header into a smart one with three lines of code.

<br />

**Demo:** [Website](https://vue-use-fixed-header.pages.dev/) — **Examples:** [Vue 3](https://stackblitz.com/edit/vitejs-vite-nc7ey2?file=index.html,src%2Fcomponents%2FPage.vue) - [Nuxt 3](https://stackblitz.com/edit/nuxt-starter-zbtjes?file=layouts%2Fdefault.vue)

<br />

## Features

-  **Dead simple** - Write three lines of code and you're ready to go
-  **Enjoyable** - When scrolling down, the header is hidden, when scrolling up, the header is shown.
-  **Smart** - Behaves as expected on page load, hovering, dropdown navigation, top-reached and reduced motion.
-  **Dynamic** - Functionalities are automatically enabled/disabled if your header turns from fixed/sticky to something else or it is hidden at different viewports
-  **Flexible** - Works with any scrolling container

<br />

## Installation

```bash
pnpm add vue-use-fixed-header
```

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

### Media queries

Hence feel free to have code like this, it will just work as expected:

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

### Advanced scenarios

Let's suppose your header in some pages is not fixed/sticky and you're using some reactive logic to determine whether it should be or not.

You can pass a signal to the `watch` property of `useFixedHeader` to perform a check everytime the value changes:

```vue
<script setup>
const route = useRoute()

const headerRef = ref(null)

const isPricingPage = computed(() => route.name === 'Pricing')

const { styles } useFixedHeader(headerRef, {
   watch: isPricingPage, // Will perform a check everytime the value changes
})
</script>

<template>
   <header
      ref="headerRef"
      :style="{
         ...styles,
         position: isPricingPage ? 'relative' : 'fixed',
      }"
   >
      <!-- Your content -->
   </header>
</template>
```

`useFixedHeader` will automatically toggle functionalities when navigating to/from the _Pricing_ page.

> You can pass either a `ref` or a `computed` (without `.value`).

<br />

## API

```ts
declare function useFixedHeader(
   target: Ref<HTMLElement | null> | HTMLElement | null
   options?: UseFixedHeaderOptions
): {
   styles: Readonly<ShallowRef<CSSProperties>>
   isEnter: ComputedRef<boolean>
   isLeave: ComputedRef<boolean>
}

interface UseFixedHeaderOptions {
   /**
    * Scrolling container. Matches `document.documentElement` if `null`.
    *
    * @default null
    */
   root: Ref<HTMLElement | null> | HTMLElement | null
   /**
    * Signal without `.value` (ref or computed) to be watched
    * for automatic behavior toggling.
    *
    * @default null
    */
   watch: Ref<T> | ComputedRef<T>
   /**
    * Whether to transition `opacity` propert from 0 to 1
    * and vice versa along with the `transform` property
    *
    * @default false
    */
   transitionOpacity: Ref<boolean> | boolean
}
```

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
