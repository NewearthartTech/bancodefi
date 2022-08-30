/*eslint-disable*/
// chakra imports
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'
import {
  BancoLogo,
  CreativeTimLogo,
  IconBox,
  Separator,
  SidebarHelp,
} from '@banco/components'
import React, { useState } from 'react'
import NextLink from 'next/link'

// this function creates the links and collapses that appear in the sidebar (left menu)

export const SidebarContent = ({ logoText, routes }) => {
  // to check for active links and opened collapses
  // this is for the rest of the collapses
  const [state, setState] = useState({})
  if (typeof window === 'undefined') {
    return null
  }

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    if (routeName === '/loans' && window.location.pathname === '/') return true
    return window.location.pathname.includes(routeName)
  }
  const createLinks = (routes) => {
    // Chakra Color Mode
    const activeBg = useColorModeValue('white', 'gray.700')
    const inactiveBg = useColorModeValue('white', 'gray.700')
    const activeColor = useColorModeValue('gray.700', 'white')
    const inactiveColor = useColorModeValue('gray.400', 'gray.400')

    return routes.map((prop, key) => {
      const active = activeRoute(prop.path)
      if (prop.redirect) {
        return null
      }
      if (prop.category) {
        var st = {}
        st[prop['state']] = !state[prop.state]
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: '12px',
              }}
              mx="auto"
              ps={{
                sm: '10px',
                xl: '16px',
              }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        )
      }
      return (
        <NextLink href={prop.path} key={prop.name}>
          <Button
            boxSize="initial"
            justifyContent="flex-start"
            alignItems="center"
            bg="transparent"
            mb={{
              xl: '12px',
            }}
            mx={{
              xl: 'auto',
            }}
            py="12px"
            ps={{
              sm: '10px',
              xl: '16px',
            }}
            border="none"
            _hover={undefined}
            w="100%"
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            <Flex>
              {typeof prop.icon === 'string' ? (
                <Icon>{prop.icon}</Icon>
              ) : (
                <IconBox
                  color={active ? 'white' : 'black'}
                  bg={active ? 'black' : 'white'}
                  h="30px"
                  w="30px"
                  me="12px"
                >
                  {prop.icon}
                </IconBox>
              )}
              <Text
                color={active ? 'black' : 'gray.400'}
                my="auto"
                fontSize="sm"
                fontFamily="Vesterbro"
                fontWeight="500"
              >
                {prop.name}
              </Text>
            </Flex>
          </Button>
        </NextLink>
      )
    })
  }

  const links = <>{createLinks(routes)}</>

  return (
    <>
      <Box pt={'25px'} mb="12px">
        <Link
          href={`/loans`}
          target="_blank"
          display="flex"
          lineHeight="100%"
          mb="10px"
          fontWeight="bold"
          justifyContent="flex-start"
          alignItems="center"
          fontSize="11px"
        >
          <BancoLogo w="48px" h="48px" me="10px" />
          <Text fontSize="48px" fontFamily="Vesterbro">
            {logoText}
          </Text>
        </Link>
        <Separator></Separator>
      </Box>
      <Stack direction="column" mb="40px">
        <Box>{links}</Box>
      </Stack>
    </>
  )
}
