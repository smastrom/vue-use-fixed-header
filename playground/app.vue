<template>
   <div>
      <Header />

      <div class="Content">
         <div class="Global_VisuallyHidden">
            <h1>Vue Use Fixed Header</h1>
            <p>Turn your boring fixed header into a smart and beautiful one.</p>
         </div>

         <WithContainer />
      </div>

      <footer class="Footer">
         <div>
            Made by <a target="_blank" href="https://github.com/smastrom">@smastrom</a> - MIT
            Licensed
         </div>
      </footer>
   </div>
</template>

<style scoped>
.Content {
   height: 1700px;
   display: flex;
   flex-direction: column;
   padding: 1rem;
}

.Footer {
   display: flex;
   justify-content: center;
   padding: 2rem 1rem;
   color: var(--TextColor);
}

.Footer a {
   color: var(--TextColor);
   transition: color 200ms ease-in-out;
}

@media (hover: hover) {
   .Footer a:hover {
      color: var(--AccentColor);
   }
}
</style>
