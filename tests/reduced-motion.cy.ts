describe('prefers-reduced-motion', () => {
   beforeEach(() => {
      cy.stub(window, 'matchMedia').withArgs('(prefers-reduced-motion: reduce)').returns({
         matches: true,
      })
   })

   it('Shold not add transition', () => {
      cy.mountApp()
         .scrollToHide()
         .get('header')
         .should('have.css', 'transition', 'none 0s ease 0s')

         .scrollToShow()
         .get('header')
         .should('have.css', 'transition', 'none 0s ease 0s')
   })
})
