import { TRANSITION_STYLES } from '../src/constants'

describe('Styles', () => {
   const { enterStyles, leaveStyles } = TRANSITION_STYLES

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
