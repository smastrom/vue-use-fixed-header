import { DEFAULT_ENTER_DELTA } from '../src/constants'

function testIstantRestoration() {
   return cy
      .mountApp({
         props: {
            simulateInstantRestoration: true,
         },
      })
      .get('header')
      .should('not.be.visible')
}

function testSmoothRestoration() {
   return cy
      .mountApp()
      .getScrollSubject()
      .scrollRootWithDelta({ delta: DEFAULT_ENTER_DELTA })
      .get('header')
      .should('not.be.visible')
}

describe('Page load', () => {
   it('Header is visible at top of the page', () => {
      cy.mountApp().get('header').should('be.visible')
   })

   describe('Header is hidden after scroll restoration', () => {
      it('Instant scroll', testIstantRestoration)
      it('Smooth scroll', testSmoothRestoration)
   })

   describe('Header is visible if scrolling up after scroll-restoration', () => {
      it('Instant scroll', () => {
         testIstantRestoration().scrollToShow().get('header').should('be.visible')
      })

      it('Smooth scroll', () => {
         testSmoothRestoration().scrollToShow().get('header').should('be.visible')
      })
   })
})
