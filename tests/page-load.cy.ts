import HeaderFixed from './components/HeaderFixed.vue'

import { DEFAULT_ENTER_DELTA } from '../src/constants'

describe('Page load', () => {
   it('Header is visible at top of the page', () => {
      cy.mount(HeaderFixed).get('header').should('be.visible')
   })

   it('Header is not visible after scroll-restoration', () => {
      cy.mount(HeaderFixed, {
         props: {
            simulateScrollRestoration: true,
         },
      })

      cy.get('header').should('not.be.visible')
   })

   it('Header is always visible after auto scroll (smooth-scroll on hash navigation)', () => {
      cy.mount(HeaderFixed)

      cy.scrollTo('center', { duration: 1000 })

      cy.get('header').should('be.visible')
   })

   it('Header is visible if scrolling up after scroll-restoration', () => {
      cy.mount(HeaderFixed, {
         props: {
            simulateScrollRestoration: true,
         },
      })

      cy.get('header').should('not.be.visible')

      cy.waitForIdleScroll()

      cy.scrollWithDelta({ delta: DEFAULT_ENTER_DELTA, scrollDown: false })

      cy.get('header').should('be.visible')
   })
})
