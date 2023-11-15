describe('prefers-reduced-motion', () => {
   beforeEach(() => {
      cy.stub(window, 'matchMedia').withArgs('(prefers-reduced-motion: reduce)').returns({
         matches: true,
      })
   })

   it('Shold not add transition', () => {
      cy.mountApp()
         .getScrollSubject()
         .get('header')
         .should('have.css', 'transition', 'all 0s ease 0s')
         .scrollUp()
         .get('header')
         .should('have.css', 'transition', 'all 0s ease 0s')
   })
})
