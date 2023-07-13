import { DEFAULT_LEAVE_DELTA } from '../src/constants'

describe('Scroll down', () => {
   describe('Default delta', testScrollDown)

   describe('Custom delta', () => {
      testScrollDown({ delta: 0.35, isCustom: true })
   })
})

function testScrollDown({ delta, isCustom } = { delta: DEFAULT_LEAVE_DELTA, isCustom: false }) {
   const props = isCustom ? { props: { leaveDelta: delta } } : {}

   if (isCustom && delta === DEFAULT_LEAVE_DELTA) {
      throw new Error('Custom delta is equal to default delta')
   }

   it('Header is visible if scroll delta is lower than hideDelta', () => {
      cy.mountApp(props)
         .scrollRootWithDelta({ delta: delta / 2, minDuration: 2000 })
         .get('header')
         .should('be.visible')
   })

   describe('Header is hidden if scroll delta is equal or above hideDelta', () => {
      it('Same delta', () => {
         cy.mountApp(props).scrollRootWithDelta({ delta }).get('header').should('not.be.visible')
      })

      it('Greater delta', () => {
         cy.mountApp(props)
            .scrollRootWithDelta({ delta: delta * 1.5 })
            .get('header')
            .should('not.be.visible')
      })
   })
}
