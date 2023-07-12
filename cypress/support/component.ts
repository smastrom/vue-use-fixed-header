import { mount } from 'cypress/vue'

import './commands'

import WindowScroll from '../../tests/components/WindowScroll.vue'
import ContainerScroll from '../../tests/components/ContainerScroll.vue'

import { isCustomContainer } from './constants'

import './styles.css'

declare global {
   namespace Cypress {
      interface Chainable {
         mount: typeof mount
         mountApp: (props?: Record<string, any>) => ReturnType<typeof mount>
      }
   }
}

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('mountApp', (props = {}) => {
   cy.mount(isCustomContainer ? ContainerScroll : WindowScroll, props)
})
