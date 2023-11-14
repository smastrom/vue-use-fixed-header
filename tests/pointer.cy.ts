describe('Pointer', { browser: ['chrome'] }, () => {
   it('Should not hide header if hovering target', () => {
      cy.mountApp()
         .get('header')
         .realHover({ position: 'center' })
         .scrollDown()
         .get('header')
         .should('be.visible')
   })

   it('Should hide header if not hovering target', () => {
      cy.mountApp().getScrollSubject().scrollTo('bottom').get('header').should('be.visible')
   })
})
