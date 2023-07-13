import {
   VIEWPORT_HEADER_RELATIVE as RELATIVE,
   VIEWPORT_HEADER_HIDDEN as HIDDEN,
} from '../cypress/support/constants'

import { defaultOptions } from '../src/constants'

const ITERATIONS = 10
const FIXED = RELATIVE * 2

describe('Resize', () => {
   describe('Functionalies are disabled', () => {
      it('Resizing from `position: fixed` to `position: relative`', () => {
         cy.mountApp().resizeRoot(FIXED)

         for (let i = 0; i < ITERATIONS; i++) {
            cy.resizeRoot(FIXED).wait(50).resizeRoot(RELATIVE).wait(50)
         }

         cy.getScrollSubject().scrollToHide().get('header').should('not.have.attr', 'style')
      })

      it('Resizing from `position: fixed` to `display: none`', () => {
         cy.mountApp().resizeRoot(HIDDEN)

         for (let i = 0; i < ITERATIONS; i++) {
            cy.resizeRoot(FIXED).wait(50).resizeRoot(HIDDEN).wait(50)
         }

         cy.getScrollSubject()
            .scrollToHide()
            .get('header')
            // Here we have an empty string as styles are replaced even if never applied
            .should('have.attr', 'style', '')
      })
   })

   describe('Functionalies are enabled', () => {
      it('Resizing from `position: relative` to `position: fixed`', () => {
         cy.mountApp().resizeRoot(RELATIVE)

         for (let i = 0; i < ITERATIONS; i++) {
            cy.resizeRoot(RELATIVE).wait(50).resizeRoot(FIXED).wait(50)
         }

         cy.getScrollSubject().scrollToHide().get('header').checkStyles(defaultOptions.leaveStyles)
      })

      it('Resizing from `display: none` to `position: fixed`', () => {
         cy.mountApp().resizeRoot(HIDDEN)

         for (let i = 0; i < ITERATIONS; i++) {
            cy.resizeRoot(HIDDEN).wait(50).resizeRoot(FIXED).wait(50)
         }

         cy.getScrollSubject().scrollToHide().get('header').checkStyles(defaultOptions.leaveStyles)
      })
   })
})
