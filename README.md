![npm](https://img.shields.io/npm/v/vue-use-fixed-header?color=46c119) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-use-fixed-header/tests.yml?branch=main&label=tests)
![dependency-count](https://img.shields.io/badge/dependency%20count-0-success)

# Vue Use Fixed Header

Turn your boring fixed header into a smart animated one.

<br />

**Demo:** [Website](https://vue-use-fixed-header.netlify.app/) — **Examples:** [Vue 3]() - [Nuxt 3]()

<br />

## Features

-  **Dead simple** - Call a function and you're done
-  **Lightweight** - 1kb without dependencies
-  **Smart** - When scrolling down, the header is hidden, when scrolling up, the header is shown
-  **Fine-grained** - Behaves as your users expect on page load and on top reached
-  **Beautiful** - Customizable transition applied by default
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

> :warning: Do not apply any `transition` or `visibility` property to your header since it is already done for you.

<br />

## Customization

```ts
const { isVisible } = useFixedHeader(headerRef, {
   /**
    * Keep null if content is scrolled by the window,
    * otherwise pass a custom scrolling container template ref */
   root: null,
   /**
    * Minimum acceleration delta required to show the header */
   enterDelta: 0.5, // Default
   /**
    * Minimum acceleration delta required to hide the header */
   leaveDelta: 0.15, // Default
   /**
    * Custom entrance transition styles */
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

## License

MIT Licensed - Simone Mastromattei © 2023
