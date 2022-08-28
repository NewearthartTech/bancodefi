import React from 'react'
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
export function SearchBar(props) {
  // Pass the computed styles into the `__css` prop
  const { variant, children, ...rest } = props
  // Chakra Color Mode
  const mainTeal = useColorModeValue('teal.300', 'teal.300')
  let mainText = useColorModeValue('gray.700', 'gray.200')
  let searchIcon = useColorModeValue('gray.700', 'gray.200')
  const inputBg = useColorModeValue('white', 'gray.800')
  return (
    <InputGroup
      cursor="pointer"
      bg={inputBg}
      borderRadius="15px"
      w={{
        sm: '128px',
        md: '200px',
      }}
      me={{ sm: 'auto', md: '20px' }}
      _focus={{
        borderColor: { mainTeal },
      }}
      _active={{
        borderColor: { mainTeal },
      }}
    >
      <InputLeftElement
        children={
          <IconButton
            bg="inherit"
            variant="transparent-with-icon"
            borderRadius="inherit"
            _hover={undefined}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
            aria-label={''}
            icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}
          ></IconButton>
        }
      />
      <Input
        fontSize="xs"
        color={mainText}
        placeholder="Type here..."
        borderRadius="inherit"
      />
    </InputGroup>
  )
}
