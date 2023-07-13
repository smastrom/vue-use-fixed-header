export const isCustomContainer = Cypress.env('CONTAINER') === 'custom'

export const customStyles = {
   enter: {
      transition: 'transform 0.9s ease-in-out 0s',
      transform: 'translateY(0px) scale(1.1)',
      opacity: 0.8,
   },
   leave: {
      transition: 'transform 0.7s ease-in-out 0s, opacity 0.7s ease-in-out 0s',
      transform: 'translateY(-100%) scale(1)',
      opacity: 0.2,
   },
}

export const VIEWPORT_HEADER_RELATIVE = isCustomContainer ? 475 : 768
export const VIEWPORT_HEADER_HIDDEN = isCustomContainer ? 320 : 375
