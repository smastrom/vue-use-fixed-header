import {
   VIEWPORT_HEADER_RELATIVE as RELATIVE,
   VIEWPORT_HEADER_HIDDEN as HIDDEN,
} from '../cypress/support/constants'

import { TRANSITION_STYLES } from '../src/constants'

const ITERATIONS = 10
const FIXED = RELATIVE * 2

describe('Functionalies are disabled', () => {
   it('Resizing from `position: fixed` to `position: relative`', () => {
      cy.mountApp()

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(FIXED).resizeRoot(RELATIVE)
      }

      cy.scrollDown()
      cy.get('header')
         .invoke('attr', 'style')
         .then((style) => {
            expect(style).to.be.oneOf([null, undefined, ''])
         })
   })

   it('Resizing from `position: fixed` to `display: none`', () => {
      cy.mountApp().resizeRoot(HIDDEN)

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(FIXED).resizeRoot(HIDDEN)
      }

      cy.scrollDown()
      cy.get('header')
         .invoke('attr', 'style')
         .then((style) => {
            expect(style).to.be.oneOf([null, undefined, ''])
         })
   })
})

describe('Functionalies are enabled', () => {
   it('Resizing from `position: relative` to `position: fixed`', () => {
      cy.mountApp()

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(RELATIVE).resizeRoot(FIXED)
      }

      cy.scrollDown()
      cy.get('header').should('be.hidden').checkStyles(TRANSITION_STYLES.leaveStyles)
   })

   it('Resizing from `display: none` to `position: fixed`', () => {
      cy.mountApp()

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(HIDDEN).resizeRoot(FIXED)
      }

      cy.scrollDown()
      cy.get('header').should('be.hidden').checkStyles(TRANSITION_STYLES.leaveStyles)
   })
})
