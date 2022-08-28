// Chakra imports
import { ChakraProvider, Portal, useDisclosure } from '@chakra-ui/react'
import {
  RtlProvider,
  Configurator,
  Footer,
  Sidebar,
  FixedPlugin,
  Header,
} from '@banco/components'
// Layout components
import React, { useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import routes from '@banco/routes'
// Custom Chakra theme
import { theme } from '@banco/theme'
// Custom components
import MainPanel from '../components/Layout/MainPanel'
import PanelContainer from '../components/Layout/PanelContainer'
import PanelContent from '../components/Layout/PanelContent'
import { Fonts } from '@banco/theme'
import { TzAppProvider } from '../web3/tzUtils'
import { EvmProvider } from '../web3/evmUtils'
import { ReactChildren } from '@banco/types'

interface DefaultLayout extends ReactChildren {}

export const DefaultLayout = ({ children }: DefaultLayout) => {
  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState('transparent')
  const [fixed, setFixed] = useState(false)
  const getRoute = () => {
    false
  }
  const getActiveRoute = (routes) => {
    let activeRoute = 'Default Brand Text'
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].views)
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute
        }
      } else {
        if (
          typeof window !== 'undefined' &&
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name
        }
      }
    }
    return activeRoute
  }
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes) => {
    let activeNavbar = false
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].views)
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar
        }
      } else {
        if (
          typeof window !== 'undefined' &&
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar
          }
        }
      }
    }
    return activeNavbar
  }
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views)
      }
      if (prop.category === 'account') {
        return getRoutes(prop.views)
      }
      if (prop.layout === '/rtl' || prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        )
      } else {
        return null
      }
    })
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  // Chakra Color Mode
  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <TzAppProvider appName="banco">
        <EvmProvider>
          <Fonts />
          <Sidebar
            routes={routes}
            logoText={'Banco'}
            display="none"
            sidebarVariant={sidebarVariant}
          />
          <MainPanel
            w={{
              base: 'calc(100% - 295px)',
            }}
          >
            <PanelContent>
              <PanelContainer pt="0px">
                <Header />
                {children}
              </PanelContainer>
            </PanelContent>

            <Footer />
          </MainPanel>
        </EvmProvider>
      </TzAppProvider>
    </ChakraProvider>
  )
}
function useEffect(arg0: () => void, arg1: undefined[]) {
  throw new Error('Function not implemented.')
}
