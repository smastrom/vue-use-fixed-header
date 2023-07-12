import HeaderFixed from './components/HeaderFixed.vue'

import { DEFAULT_ENTER_DELTA, defaultOptions } from '../src/constants'

describe('Transitions', () => {
   describe('Page load', () => {
      it('Styles are not applied if header is visible', () => {
         cy.mount(HeaderFixed).get('header').should('be.visible').and('not.have.attr', 'style')
      })

      it('Styles are applied if header is hidden (in order to trigger futher enter transition)', () => {
         cy.mount(HeaderFixed, {
            props: {
               simulateScrollRestoration: true,
            },
         })

         cy.get('header').should('be.hidden').checkStyles(defaultOptions.leaveStyles)
      })
   })

   it('Transitions are toggled properly', () => {
      cy.mount(HeaderFixed).waitForIdleScroll()

      cy.scrollToHide()

      cy.get('header').should('be.hidden').checkStyles(defaultOptions.leaveStyles)

      cy.scrollWithDelta({ delta: DEFAULT_ENTER_DELTA, scrollDown: false })

      cy.get('header').should('be.visible').checkStyles(defaultOptions.enterStyles)
   })
})
