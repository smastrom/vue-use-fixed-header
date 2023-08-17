import {
   VIEWPORT_HEADER_RELATIVE as RELATIVE,
   VIEWPORT_HEADER_HIDDEN as HIDDEN,
} from '../cypress/support/constants'

import { defaultOptions } from '../src/constants'

const ITERATIONS = 10
const FIXED = RELATIVE * 2

describe('Functionalies are disabled', () => {
   it('Resizing from `position: fixed` to `position: relative`', () => {
      cy.mountApp().resizeRoot(FIXED)

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(FIXED).wait(100).resizeRoot(RELATIVE).wait(100)
      }

      cy.getScrollSubject().scrollToHide()
      cy.get('header')
         .invoke('attr', 'style')
         .then((style) => {
            expect(style).to.be.oneOf([null, undefined, ''])
         })
   })

   it('Resizing from `position: fixed` to `display: none`', () => {
      cy.mountApp().resizeRoot(HIDDEN)

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(FIXED).wait(100).resizeRoot(HIDDEN).wait(100)
      }

      cy.getScrollSubject().scrollToHide()
      cy.get('header')
         .invoke('attr', 'style')
         .then((style) => {
            expect(style).to.be.oneOf([null, undefined, ''])
         })
   })
})

describe('Functionalies are enabled', () => {
   it('Resizing from `position: relative` to `position: fixed`', () => {
      cy.mountApp().resizeRoot(RELATIVE)

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(RELATIVE).wait(100).resizeRoot(FIXED).wait(100)
      }

      cy.getScrollSubject().scrollToHide()
      cy.get('header').checkStyles(defaultOptions.leaveStyles)
   })

   it('Resizing from `display: none` to `position: fixed`', () => {
      cy.mountApp().resizeRoot(HIDDEN)

      for (let i = 0; i < ITERATIONS; i++) {
         cy.resizeRoot(HIDDEN).wait(100).resizeRoot(FIXED).wait(100)
      }

      cy.getScrollSubject().scrollToHide()
      cy.get('header').checkStyles(defaultOptions.leaveStyles)
   })
})
