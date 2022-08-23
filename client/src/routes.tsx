// import
import { Tables, Billing, Profile, SignIn, SignUp } from '@banco/views'

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
  BankIcon,
  PlusIcon,
  CheckIcon,
  HandIcon,
} from '@banco/components'

var dashRoutes = [
  {
    path: '/loans',
    name: 'Marketplace',
    icon: <BankIcon color="inherit" />,
  },
  {
    path: '/apply',
    name: 'Apply for Loan',
    icon: <PlusIcon color="inherit" />,
  },
  {
    name: 'Your Account',
    category: 'account',
    state: 'pageCollapse',
    views: [
      {
        path: '/funded',
        name: 'Loans Funded',
        icon: <CheckIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: '/admin',
      },
      {
        path: '/borrowed',
        name: 'Loans Borrowed',
        icon: <HandIcon color="inherit" />,
        component: SignIn,
        layout: '/auth',
      },
    ],
  },
]
export default dashRoutes
