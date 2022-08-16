// Libs
/* -------------------------------------------------------------------------- */

import { createSlice } from '@reduxjs/toolkit'

// Types
/* -------------------------------------------------------------------------- */

export type ActiveOverlay =
  | undefined
  | 'my-account'
  | 'main-nav'
  | 'quick-trade'
  | 'trade-window'
  | 'account-updates'

export type LoanDurationWindow = 'days' | 'months' | 'years'

export interface FormState {
  nftVerified: boolean
  ERCaddress: string
  tokenAddress: string
  loanAmount: number
  loanDuration: number
  loanDurationWindow: LoanDurationWindow
  interestAmount: number
}

export type FilterType = 'boolean' | 'range'
export type BooleanFilter = { enabled: boolean }
export type RangeFilter = { min: number; max: number }
export type FilterInfo = BooleanFilter | RangeFilter
export interface Filter {
  filterType: FilterType
  filterInfo: FilterInfo
}

// Initial State
/* -------------------------------------------------------------------------- */

const initialState: FormState = {
  nftVerified: false,
  ERCaddress: '',
  tokenAddress: '',
  loanAmount: 0,
  loanDuration: 0,
  loanDurationWindow: 'days',
  interestAmount: 0,
}

// Slice
/* -------------------------------------------------------------------------- */

export const { reducer, actions } = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setVerified(state, action: { payload: boolean }) {
      state.nftVerified = action.payload
    },
    setERCAddress(state, action: { payload: string }) {
      state.ERCaddress = action.payload
    },

    setTokenAddress(state, action: { payload: string }) {
      state.tokenAddress = action.payload
    },
    setLoanDurationWindow(state, action: { payload: LoanDurationWindow }) {
      state.loanDurationWindow = action.payload
    },
    setLoanAmount(state, action: { payload: number }) {
      state.loanAmount = action.payload
    },
    setloanDuration(state, action: { payload: number }) {
      state.loanDuration = action.payload
    },
    setInterestAmount(state, action: { payload: number }) {
      state.interestAmount = action.payload
    },
  },
})
