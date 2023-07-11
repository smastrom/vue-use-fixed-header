# Vue Use Fixed Header

Turn your boring fixed header into a smart and beautiful one.

<br />

**Demo:** [Visit Website]() — **Examples:** [Nuxt 3]() - [Vue 3]()

<br />

## Features

-  **Dead simple** - Few props and you're done
-  **Lightweight** - Less than 1kb without dependencies
-  **Smart** - When scrolling down, the header is hidden, when scrolling up, the header is shown
-  **Fine-grained** - Visibility behaves correctly on page load and on top reached
-  **Beautiful** - Beatiful transition are applied by default and can be customized
-  **Customizable** - Touch the acceleration delta for both hiding and showing and use any scrolling container

<br />

## Usage

Pass your header's template ref to `useFixedHeader`. That's it!

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

> Do not apply any transition to your header, it will be done automatically for you. See below how to customize them.

<br />

## Customization

```ts
const { isVisible } = useFixedHeader(headerRef, {
   /**
    * Keep null if content is scrolled by the window,
    * otherwise pass a custom scrolling container ref */
   root: null,
   /**
    * Minimum acceleration delta required to show the header */
   enterDelta: 0.5,
   /**
    * Minimum acceleration delta required to hide the header */
   leaveDelta: 0.25,
   /**
    * Custom entrance transition styles */
   enterStyles: {
      transition: `transform 300ms ease-out`,
      transform: 'translateY(0px)',
      opacity: 1,
   },
   /**
    * Custom leave transition styles */
   leaveStyles: {
      transition: `transform 600ms ease-out, opacity 600ms ease-out`,
      transform: 'translateY(-100%)',
      opacity: 0,
   },
})
```

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
