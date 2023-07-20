import { DEFAULT_LEAVE_DELTA } from '../src/constants'

describe('Pointer', { browser: ['chrome'] }, () => {
   it('Should not hide header if hovering target', () => {
      cy.mountApp()
         .get('header')
         .realHover({ position: 'center' })
         .scrollRootWithDelta({ delta: DEFAULT_LEAVE_DELTA * 2, minDuration: 3000 })
         .get('header')
         .should('be.visible')
   })
})
