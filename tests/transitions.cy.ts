import { customStyles } from '../cypress/support/constants'
import { defaultOptions } from '../src/constants'

describe('Transitions', () => {
   describe('Page load', () => {
      it('Styles are applied if header is visible, except transition', () => {
         const { transition, ...enterStyles } = defaultOptions.enterStyles
         cy.mountApp().get('header').should('be.visible').checkStyles(enterStyles)
      })

      it('Styles are applied if header is hidden (in order to trigger further enter transition)', () => {
         cy.mountApp({
            props: {
               simulateInstantRestoration: true,
            },
         })

         const { transition, ...leaveStyles } = defaultOptions.leaveStyles
         cy.get('header').should('be.hidden').checkStyles(leaveStyles)
      })
   })

   it('Transitions are toggled properly', () => {
      cy.mountApp()
         .scrollToHide()
         .get('header')
         .should('be.hidden')
         .checkStyles(defaultOptions.leaveStyles)

      cy.scrollToShow().get('header').should('be.visible').checkStyles(defaultOptions.enterStyles)
   })

   it('Custom transitions are toggled properly', () => {
      cy.mountApp({
         props: {
            enterStyles: customStyles.enter,
            leaveStyles: customStyles.leave,
         },
      })
         .scrollToHide()
         .get('header')
         .should('be.hidden')
         .checkStyles(customStyles.leave)

      cy.scrollToShow().get('header').should('be.visible').checkStyles(customStyles.enter)
   })
})
