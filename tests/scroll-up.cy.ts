import HeaderFixed from './components/HeaderFixed.vue'

import { DEFAULT_ENTER_DELTA, DEFAULT_LEAVE_DELTA } from '../src/constants'

describe('Scroll up', () => {
   describe('Header is visible if scroll delta is equal or above enterDelta', () => {
      it('Same delta', () => {
         cy.mount(HeaderFixed).waitForIdleScroll()

         cy.scrollToHide()

         cy.scrollWithDelta({ delta: DEFAULT_ENTER_DELTA, scrollDown: false })

         cy.get('header').should('be.visible')
      })

      it('Greater delta', () => {
         cy.mount(HeaderFixed).waitForIdleScroll()

         cy.scrollToHide()

         cy.scrollWithDelta({ delta: DEFAULT_ENTER_DELTA * 15, scrollDown: false })

         cy.get('header').should('be.visible')
      })
   })

   it('Header is hidden if scroll delta is below enterDelta', () => {
      cy.mount(HeaderFixed).waitForIdleScroll()

      cy.scrollToHide()

      cy.scrollWithDelta({ delta: DEFAULT_ENTER_DELTA / 2 })

      cy.get('header').should('not.be.visible')
   })
})
