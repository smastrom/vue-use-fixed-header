# vue-fixed

### A dead-simple smart fixed header for Vue.js

<br />

## Why should you use it?

-  It's dead simple: few props and you're done
-  It's lightweight: just 600B
-  It's smart: when scrolling down, the header is hidden, when scrolling up, the header is shown
-  It's customizable: touch the acceleration delta to make it more or less sensitive

<br />

## How to use it?

Pass your header's template ref to `useFixed`. If you want you can customize the acceleration delta (default is 800px/s).

There's only one thing you need to be careful about, your header should not have any `position` property set since `vue-fixed` takes care of it.

```html
<script setup lang="ts">
   import { ref } from 'vue'
   import { useFixed } from 'vue-fixed'

   const headerRef = ref<HTMLElement | null>(null)

   const { isFixed } = useFixed(headerRef, {
      delta: 800,
   })
</script>

<template>
   <header class="Header" ref="headerRef">
      <ul>
         <li><a href="/home">Home</a></li>
         <li><a href="/about">About</a></li>
         <li><a href="/contact">Contact</a></li>
      </ul>
   </header>
</template>

<style scoped>
   .Header {
      /* Your header styles */
   }
</style>
```
