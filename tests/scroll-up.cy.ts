import { DEFAULT_ENTER_DELTA } from '../src/constants'

describe('Scroll up', () => {
   describe('Default delta', testScrollUp)

   describe('Custom delta', () => {
      testScrollUp({ delta: 0.35, isCustom: true })
   })
})

function testScrollUp({ delta, isCustom } = { delta: DEFAULT_ENTER_DELTA, isCustom: false }) {
   const props = isCustom ? { props: { enterDelta: delta } } : {}

   if (isCustom && delta === DEFAULT_ENTER_DELTA) {
      throw new Error('Custom delta is equal to default delta')
   }

   it('Header is hidden if scroll delta is lower than enterDelta', () => {
      cy.mountApp(props)
         .waitForIdleScroll()
         .scrollToHide()
         .scrollRootWithDelta({ delta: delta / 2 })
         .get('header')
         .should('not.be.visible')
   })

   describe('Header is visible if scroll delta is equal or above enterDelta', () => {
      it('Same delta', () => {
         cy.mountApp(props)
            .waitForIdleScroll()
            .scrollToHide()
            .scrollRootWithDelta({ delta, scrollDown: false })
            .get('header')
            .should('be.visible')
      })

      it('Greater delta', () => {
         cy.mountApp(props)
            .waitForIdleScroll()
            .scrollToHide()
            .scrollRootWithDelta({ delta: delta * 15, scrollDown: false })
            .get('header')
            .should('be.visible')
      })
   })
}
