import { isCustomContainer } from './constants'

import type { CSSProperties } from 'vue'

import 'cypress-wait-frames'

declare global {
   namespace Cypress {
      interface Chainable {
         getScrollSubject: () => Cypress.Chainable
         scrollUp: () => Cypress.Chainable
         scrollDown: () => Cypress.Chainable
         checkStyles: (styles: CSSProperties) => Cypress.Chainable
         resizeRoot: (newWidth: number) => Cypress.Chainable
      }
   }
}

Cypress.Commands.add('getScrollSubject', () => {
   if (isCustomContainer) return cy.get('.Scroller')
   return cy.window()
})

Cypress.Commands.add('resizeRoot', (newWidth: number) => {
   if (isCustomContainer) {
      return cy
         .get('.Scroller')
         .then(($el) => {
            $el.css({ width: `${newWidth}px` })
         })
         .waitFrames({
            subject: () => cy.get('.Scroller'),
            property: 'clientWidth',
            frames: 10,
         })
   }

   return cy.viewport(newWidth, newWidth).waitFrames({
      subject: cy.window,
      property: 'outerWidth',
      frames: 10,
   })
})

Cypress.Commands.add('scrollUp', () => cy.getScrollSubject().scrollTo('top', { duration: 300 }))

Cypress.Commands.add('scrollDown', () =>
   cy.getScrollSubject().scrollTo('bottom', { duration: 300 })
)

Cypress.Commands.add('checkStyles', { prevSubject: 'element' }, (subject, styles) => {
   Object.entries(styles).forEach(([property, value]) => {
      cy.wrap(subject).should('have.attr', 'style').and('include', `${property}: ${value}`)
   })
})
