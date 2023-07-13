import { customStyles } from '../cypress/support/constants'
import { DEFAULT_ENTER_DELTA, defaultOptions } from '../src/constants'

describe('Transitions', () => {
   describe('Page load', () => {
      it('Styles are not applied if header is visible', () => {
         cy.mountApp().get('header').should('be.visible').and('not.have.attr', 'style')
      })

      it('Styles are applied if header is hidden (in order to trigger futher enter transition)', () => {
         cy.mountApp({
            props: {
               simulateInstantRestoration: true,
            },
         })

         cy.get('header').should('be.hidden').checkStyles(defaultOptions.leaveStyles)
      })
   })

   it('Transitions are toggled properly', () => {
      cy.mountApp()
         .scrollToHide()
         .get('header')
         .should('be.hidden')
         .checkStyles(defaultOptions.leaveStyles)

      cy.scrollRootWithDelta({ delta: DEFAULT_ENTER_DELTA, scrollDown: false })
         .get('header')
         .should('be.visible')
         .checkStyles(defaultOptions.enterStyles)
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

      cy.scrollRootWithDelta({ delta: DEFAULT_ENTER_DELTA, scrollDown: false })
         .get('header')
         .should('be.visible')
         .checkStyles(customStyles.enter)
   })
})
