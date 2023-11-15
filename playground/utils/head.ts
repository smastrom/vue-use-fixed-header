const siteName = 'Vue Use Fixed Header'
const description = 'Turn your boring fixed header into a smart one with three lines of code.'

export function getHead() {
   return {
      title: `${siteName} - ${description}`,
      link: [
         {
            rel: 'icon',
            href: '/favicon.ico',
         },
      ],
      htmlAttrs: {
         lang: 'en',
      },
      meta: [
         {
            hid: 'description',
            name: 'description',
            content: description,
         },
         {
            hid: 'og:title',
            property: 'og:title',
            content: `${siteName} - ${description}`,
         },
         {
            hid: 'og:description',
            property: 'og:description',
            content: description,
         },
         {
            hid: 'og:image',
            property: 'og:image',
            content: '/og-image.jpg',
         },
         {
            hid: 'og:url',
            property: 'og:url',
            content: 'https://vue-use-fixed-header.netlify.app',
         },
         {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: `${siteName} - ${description}`,
         },
         {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: description,
         },

         {
            hid: 'twitter:image',
            name: 'twitter:image',
            content: '/og-image.jpg',
         },
         {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary_large_image',
         },
      ],
   }
}
