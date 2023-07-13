import { DEFAULT_LEAVE_DELTA } from '../../src/constants'
import { isCustomContainer } from './constants'

import type { CSSProperties } from 'vue'

type scrollRootWithDeltaOptions = {
   delta: number
   scrollDown?: boolean
   minDuration?: number
}

declare global {
   namespace Cypress {
      interface Chainable {
         getScrollSubject: () => Cypress.Chainable
         scrollRootWithDelta: (options: scrollRootWithDeltaOptions) => Cypress.Chainable
         scrollToHide: () => Cypress.Chainable
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
      return cy.get('.Scroller').then(($el) => {
         $el.css({ width: `${newWidth}px` })
      })
   }

   return cy.viewport(newWidth, newWidth)
})

Cypress.Commands.add(
   'scrollRootWithDelta',
   ({ delta, scrollDown = true, minDuration = 1000 }: scrollRootWithDeltaOptions) => {
      let distance = delta * minDuration
      let duration = minDuration

      // If obtained distance is below header height, throw an error
      cy.get('header').then(($header) => {
         const headerHeight = $header.height()

         if (headerHeight && distance < headerHeight) {
            throw new Error(`Scrolling distance is less than ${headerHeight}px. Increase duration.`)
         }
      })

      const scrollDistance = scrollDown ? distance : -1 * distance

      cy.log(`Scrolling ${scrollDistance}px with a delta of ${delta} in ${duration}ms`)

      return cy.getScrollSubject().scrollTo(0, scrollDistance, { duration })
   }
)

Cypress.Commands.add('scrollToHide', () => cy.scrollRootWithDelta({ delta: DEFAULT_LEAVE_DELTA }))

Cypress.Commands.add('checkStyles', { prevSubject: 'element' }, (subject, styles) => {
   Object.entries(styles).forEach(([property, value]) => {
      // Webkit removes the 0s delay specified in our styles
      if (Cypress.isBrowser('webkit') && property === 'transition') {
         value = value.replaceAll(' 0s', '')
      }

      cy.wrap(subject).should('have.attr', 'style').and('include', `${property}: ${value}`)
   })
})
