import HeaderFixed from './components/HeaderFixed.vue'

import { DEFAULT_LEAVE_DELTA } from '../src/constants'

describe('Scroll down', () => {
   describe('Header is hidden if scroll delta is equal or above hideDelta', () => {
      it('Same delta', () => {
         cy.mount(HeaderFixed).waitForIdleScroll()

         cy.scrollWithDelta({ delta: DEFAULT_LEAVE_DELTA })

         cy.get('header').should('not.be.visible')
      })

      it('Greater delta', () => {
         cy.mount(HeaderFixed).waitForIdleScroll()

         cy.scrollWithDelta({ delta: DEFAULT_LEAVE_DELTA * 1.5 })

         cy.get('header').should('not.be.visible')
      })
   })

   it('Header is visible if scroll delta is below hideDelta', () => {
      cy.mount(HeaderFixed).waitForIdleScroll()

      cy.scrollWithDelta({ delta: DEFAULT_LEAVE_DELTA / 2 })

      cy.get('header').should('be.visible')
   })
})
