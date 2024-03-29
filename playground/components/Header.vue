<script setup lang="ts">
import { ref } from 'vue'
import { useFixedHeader } from 'vue-use-fixed-header'

const headerRef = ref<HTMLElement | null>(null)

const { styles } = useFixedHeader(headerRef)

const linkProps = { target: '_blank', class: 'Nav_List_Link' }
</script>

<template>
   <div>
      <header class="Header" ref="headerRef" :style="styles">
         <div class="Nav">
            <h2 class="Global_Logo">Vufh</h2>
            <ul class="Nav_List">
               <li class="Nav_List_Dropdown_Trigger Nav_List_Hidden">
                  <a v-bind="linkProps" href="https://github.com/smastrom/vue-use-fixed-header">
                     Dropdown
                  </a>

                  <ul class="Nav_List_Dropdown">
                     <li><a v-bind="linkProps" href="#">Dropdown Item 1</a></li>
                     <li><a v-bind="linkProps" href="#">Dropdown Item 2</a></li>
                     <li><a v-bind="linkProps" href="#">Dropdown Item 3</a></li>
                  </ul>
               </li>

               <li>
                  <a v-bind="linkProps" href="https://github.com/smastrom/vue-use-fixed-header">
                     GitHub
                  </a>
               </li>
               <li class="Nav_List_Hidden">
                  <a v-bind="linkProps" href="https://www.npmjs.com/package/vue-use-fixed-header">
                     NPM
                  </a>
               </li>
               <li class="Nav_List_Hidden">
                  <a
                     v-bind="linkProps"
                     href="https://stackblitz.com/@smastrom/collections/vue-use-fixed-header"
                  >
                     Examples
                  </a>
               </li>
               <li>
                  <a
                     class="Nav_List_Button"
                     target="_blank"
                     href="https://github.com/smastrom/vue-use-fixed-header/blob/main/playground/components/Header.vue"
                  >
                     See Code
                  </a>
               </li>
            </ul>
         </div>
      </header>
   </div>
</template>

<style scoped>
.Header {
   display: flex;
   width: 100%;
   top: 0;
   left: 0;
   justify-content: center;
   position: fixed;
   z-index: 10;
}

.Nav {
   background-color: white;
   border-radius: 1rem;
   width: 1280px;
   max-width: 100%;
   margin: 1rem;
   padding: 0.875rem;
   display: flex;
   align-items: center;
   justify-content: space-between;
   box-shadow: var(--Shadow);
}

.Nav_List {
   height: 100%;
   display: flex;
   align-items: center;
   list-style: none;
   gap: 3rem;
}

.Nav_List li {
   height: 100%;
   display: flex;
   align-items: center;
}

.Nav_List_Link {
   color: var(--TextColor);
   text-decoration: none;
   transition: color 200ms ease-in-out;
}

.Nav_List_Dropdown_Trigger {
   position: relative;
}

.Nav_List_Dropdown {
   position: absolute;
   top: 40px;
   left: -1rem;
   width: 200px;
   background-color: var(--WhiteColor);
   border-radius: 0.5rem;
   padding: 1rem;
   display: none;
   flex-direction: column;
   gap: 1rem;
   list-style: none;
}

.Nav_List_Button {
   background-color: var(--AccentColor);
   color: var(--WhiteColor);
   padding: 0.5rem 1rem;
   border-radius: 0.5rem;
   transition: all 200ms ease-in-out;
   text-decoration: none;
}

@media (hover: hover) {
   .Nav_List_Dropdown_Trigger:hover .Nav_List_Dropdown {
      display: flex;
   }

   .Nav_List_Dropdown_Trigger:hover > a {
      color: var(--AccentColor);
   }

   .Nav_List_Link:hover,
   .Nav_List_Dropdown a:hover {
      color: var(--AccentColor);
   }

   .Nav_List_Button:hover {
      opacity: 0.75;
   }
}

@media (max-width: 768px) {
   .Nav {
      margin: 1rem;
   }
   .Nav_List {
      gap: 2rem;
   }
   .Nav_List .Nav_List_Hidden {
      display: none;
   }
}
</style>
