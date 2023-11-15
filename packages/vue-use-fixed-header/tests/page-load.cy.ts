function testIstantRestoration() {
   return cy
      .mountApp()
      .getScrollSubject()
      .scrollTo('bottom', { duration: 0 })
      .get('header')
      .should('not.be.visible')
}

function testSmoothRestoration() {
   return cy.mountApp().scrollDown().get('header').should('not.be.visible')
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
         testIstantRestoration().scrollUp().get('header').should('be.visible')
      })

      it('Smooth scroll', () => {
         testSmoothRestoration().scrollUp().get('header').should('be.visible')
      })
   })
})
