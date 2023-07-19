import App from './components/Watch.vue'

import { ref } from 'vue'

import { defaultOptions } from '../src/constants'

describe('Watch', () => {
   if (!Cypress.env('CONTAINER')) {
      it('Toggles functionalities when reactive source changes', () => {
         const isRelative = ref(false)

         cy.mount(App, { props: { watch: isRelative } })
            .scrollToHide()
            .get('header')
            .checkStyles(defaultOptions.leaveStyles)

            .then(() => (isRelative.value = true))
            .get('header')
            .should('have.attr', 'style')
            .and('be.eq', 'position: relative;')

            .then(() => (isRelative.value = false))
            .scrollToShow()
            .get('header')
            .checkStyles(defaultOptions.enterStyles)

            .then(() => (isRelative.value = true))
            .get('header')
            .should('have.attr', 'style')
            .and('be.eq', 'position: relative;')
      })
   }
})
