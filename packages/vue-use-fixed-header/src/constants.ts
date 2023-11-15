export const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const TRANSITION_STYLES = {
   enterStyles: {
      transition: `all 0.35s ${EASING} 0s`,
      transform: 'translateY(0px)',
   },
   leaveStyles: {
      transition: `all 0.5s ${EASING} 0s`,
      transform: 'translateY(-101%)',
   },
}
