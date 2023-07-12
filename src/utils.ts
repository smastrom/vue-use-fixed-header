export function mergeDefined(defaults: Record<string, any>, options: Record<string, any>) {
   const result = { ...defaults }

   for (const key in options) {
      if (typeof options[key] !== 'undefined') {
         result[key] = options[key]
      }
   }

   return result
}
