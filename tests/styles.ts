import { TRANSITION_STYLES } from '../src/constants'

describe('Styles', () => {
   const { enterStyles, leaveStyles } = TRANSITION_STYLES

   describe('Page load', () => {
      it('Styles are applied if header is visible, except transition', () => {
         cy.mountApp()
            .get('header')
            .should('be.visible')
            .should('have.attr', 'style')
            .and('be.eq', `transform: ${enterStyles.transform};`)
      })

      it('Styles are applied if header is hidden (in order to trigger further enter transition)', () => {
         cy.mountApp({
            props: {
               instantScrollRestoration: true,
            },
         })

         cy.get('header').should('be.hidden').checkStyles(leaveStyles)
      })
   })

   it('Transitions are toggled properly', () => {
      cy.mountApp()
         .scrollDown()
         .get('header')
         .should('be.hidden')
         .checkStyles(leaveStyles)

         .scrollUp()
         .get('header')
         .should('be.visible')
         .checkStyles(enterStyles)
   })
})
