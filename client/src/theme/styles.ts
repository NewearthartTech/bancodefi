import { mode } from '@chakra-ui/theme-tools'

export const globalStyles = {
  colors: {
    gray: {
      100: '#C4C4C4',
      700: '#1f2733',
    },
    black: {
      100: '#1b1b1b',
    },
    aquamarine: {
      400: '#00C2CB',
    },
    tezosBlue: {
      400: '#2c7df7',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'gray.800')(props),
        fontFamily: 'Jakarta',
      },
      html: {
        fontFamily: 'Jakarta',
      },
    }),
  },
}
