import HeaderFixed from './components/HeaderFixed.vue'

it('Header is displayed on mount', () => {
   cy.mount(HeaderFixed).get('header').should('be.visible')
})

it.only('Header is not displayed on mount if scrolling is triggered / restored', () => {
   cy.mount(HeaderFixed)

   cy.waitForIdleScroll()

   cy.scrollWithDelta(0.5)
})
