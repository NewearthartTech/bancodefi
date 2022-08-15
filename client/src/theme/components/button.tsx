export const buttonStyles = {
  components: {
    Button: {
      variants: {
        'no-hover': {
          _hover: {
            boxShadow: 'none',
          },
        },
        'transparent-with-icon': {
          bg: 'transparent',
          fontWeight: 'bold',
          borderRadius: 'inherit',
          cursor: 'pointer',
          _hover: 'none',
          transform: 'none',
          borderColor: 'transparent',
          boxShadow: 'none',
        },
        dark: {
          bg: 'black.100',
          color: 'white',
          fontWeight: 'normal',
          padding: '0px 30px',
          borderRadius: '24px',
          cursor: 'pointer',
          _hover: 'none',
          border: 'none',
          _active: {
            bg: 'transparent',
            transform: 'none',
            borderColor: 'transparent',
          },
          _focus: {
            boxShadow: 'none',
          },
        },
        'with-shadow': {
          boxShadow: '0 0 2px 2px #efdfde',
        },
      },
      baseStyle: {
        borderRadius: '15px',
        _focus: {
          boxShadow: 'none',
        },
      },
    },
  },
}
