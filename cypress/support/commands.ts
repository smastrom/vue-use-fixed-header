import 'cypress-wait-frames'

import { DEFAULT_LEAVE_DELTA, IDLE_SCROLL_FRAME_COUNT } from '../../src/constants'
import { isCustomContainer } from './constants'

import type { CSSProperties } from 'vue'

type ScrollWithDeltaOptions = {
   delta: number
   scrollDown?: boolean
   minDuration?: number
}

declare global {
   namespace Cypress {
      interface Chainable {
         getScrollSubject: () =>
            | Cypress.Chainable<JQuery<HTMLElement>>
            | Cypress.Chainable<Cypress.AUTWindow>
         scrollWithDelta: (options: ScrollWithDeltaOptions) => void
         waitForIdleScroll: () => void
         scrollToHide: () => void
         checkStyles: (styles: CSSProperties) => void
      }
   }
}

Cypress.Commands.add('getScrollSubject', () => {
   if (isCustomContainer) return cy.get('.Scroller')
   return cy.window()
})

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

      const scrollDistance = scrollDown ? distance : -1 * distance

      cy.log(`Scrolling ${scrollDistance}px with ${delta} delta in ${duration}ms`)

      cy.getScrollSubject().scrollTo(0, scrollDistance, { duration })
   }
)

Cypress.Commands.add('waitForIdleScroll', () => {
   cy.waitFrames({
      subject: isCustomContainer ? () => cy.get('.Scroller') : (cy.document as any),
      property: 'scrollTop',
      frames: IDLE_SCROLL_FRAME_COUNT,
   })
})

Cypress.Commands.add('scrollToHide', () => {
   cy.scrollWithDelta({ delta: DEFAULT_LEAVE_DELTA })
   cy.get('header').should('not.be.visible')
})

Cypress.Commands.add('checkStyles', { prevSubject: 'element' }, (subject, styles) => {
   Object.entries(styles).forEach(([property, value]) => {
      cy.wrap(subject).should('have.attr', 'style').and('include', `${property}: ${value}`)
   })
})
