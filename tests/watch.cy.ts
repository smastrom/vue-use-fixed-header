import App from './components/Watch.vue'

import { ref } from 'vue'
import { TRANSITION_STYLES as STYLES } from '../src/constants'

describe('Watch', () => {
   if (!Cypress.env('CONTAINER')) {
      it('Toggles functionalities when reactive source changes', () => {
         const isRelative = ref(false)

         cy.mount(App, { props: { watch: isRelative } })

         cy.scrollDown()
            .get('header')
            .checkStyles({ ...STYLES.leaveStyles, visibility: 'hidden' })
            .then(() => (isRelative.value = true))

         cy.get('header')
            .should('have.attr', 'style')
            .and('be.eq', 'position: relative;')
            .then(() => (isRelative.value = false))

         cy.scrollUp()
            .get('header')
            .checkStyles(STYLES.enterStyles)
            .then(() => (isRelative.value = true))

            .get('header')
            .should('have.attr', 'style')
            .and('be.eq', 'position: relative;')
      })
   }
})
