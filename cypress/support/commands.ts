import 'cypress-wait-frames'

import { DEFAULT_LEAVE_DELTA, IDLE_SCROLL_FRAME_COUNT, defaultOptions } from '../../src/constants'

import type { CSSProperties } from 'vue'

type ScrollWithDeltaOptions = {
   delta: number
   scrollDown?: boolean
   minDuration?: number
}

declare global {
   namespace Cypress {
      interface Chainable {
         scrollWithDelta: (options: ScrollWithDeltaOptions) => void
         waitForIdleScroll: () => void
         scrollToHide: () => void
         checkStyles: (styles: CSSProperties) => void
      }
   }
}

Cypress.Commands.add(
   'scrollWithDelta',
   ({ delta, scrollDown = true, minDuration = 1000 }: ScrollWithDeltaOptions) => {
      let distance = delta * minDuration
      let duration = minDuration

      // If obtained distance is below header height, throw an error
      cy.get('header').then(($header) => {
         const headerHeight = $header.height()

         if (headerHeight && distance < headerHeight) {
            throw new Error(
               `Scrolling distance (${distance}) is less than ${headerHeight}px. Increase second parameter (minDuration).`
            )
         }
      })

      cy.log(`Scrolling ${distance}px with ${delta} delta in ${duration}ms`)

      cy.scrollTo(0, scrollDown ? distance : -1 * distance, { duration })
   }
)

Cypress.Commands.add('waitForIdleScroll', () => {
   cy.waitFrames({ subject: cy.document, property: 'scrollTop', frames: IDLE_SCROLL_FRAME_COUNT })
})

Cypress.Commands.add('scrollToHide', () => {
   cy.scrollWithDelta({ delta: DEFAULT_LEAVE_DELTA, minDuration: 2000 })

   cy.get('header').should('not.be.visible')
})

Cypress.Commands.add('checkStyles', { prevSubject: 'element' }, (subject, styles) => {
   Object.entries(styles).forEach(([property, value]) => {
      cy.wrap(subject).should('have.attr', 'style').and('include', `${property}: ${value}`)
   })
})
