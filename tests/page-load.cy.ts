import { DEFAULT_ENTER_DELTA } from '../src/constants'

describe('Page load', () => {
   it('Header is visible at top of the page', () => {
      cy.mountApp().get('header').should('be.visible')
   })

   it('Header is not visible after scroll-restoration', () => {
      cy.mountApp({
         props: {
            simulateScrollRestoration: true,
         },
      })
         .get('header')
         .should('not.be.visible')
   })

   it('Header is always visible after auto scroll (smooth-scroll on hash navigation)', () => {
      cy.mountApp()
         .getScrollSubject()
         .scrollTo('center', { duration: 1000 })
         .get('header')
         .should('be.visible')
   })

   it('Header is visible if scrolling up after scroll-restoration', () => {
      cy.mountApp({
         props: {
            simulateScrollRestoration: true,
         },
      })

         .get('header')
         .should('not.be.visible')
         .waitForIdleScroll()
         .scrollRootWithDelta({ delta: DEFAULT_ENTER_DELTA, scrollDown: false })
         .get('header')
         .should('be.visible')
   })
})
