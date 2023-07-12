export const isCustomContainer = Cypress.env('CONTAINER') === 'custom'

export const customStyles = {
   enter: {
      transition: 'transform 900ms ease-in-out 0s',
      transform: 'translateY(0px) scale(1.1)',
      opacity: 0.8,
   },
   leave: {
      transition: 'transform 700ms ease-in-out 0s, opacity 700ms ease-in-out 0s',
      transform: 'translateY(-100%) scale(1)',
      opacity: 0.2,
   },
}
