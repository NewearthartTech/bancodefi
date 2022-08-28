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

export interface FilterState {
  filterBundled: boolean
  principalAmountRange: number[]
  principalAmountMin: number
  principalAmountMax: number
  interestRange: number[]
  interestMin: number
  interestMax: number
  durationRange: number[]
  durationMin: number
  durationMax: number
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

const initialState: FilterState = {
  filterBundled: false,
  principalAmountRange: [0, 100000],
  principalAmountMin: 0,
  principalAmountMax: 100000,
  interestRange: [0, 100000],
  interestMin: 1.5,
  interestMax: 10.99,
  durationRange: [0, 100000],
  durationMin: 10,
  durationMax: 100,
}

// Slice
/* -------------------------------------------------------------------------- */

export const { reducer, actions } = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setBundled(state, action: { payload: boolean }) {
      state.filterBundled = action.payload
    },
    setPrincipalAmount(state, action: { payload: number[] }) {
      state.principalAmountRange = action.payload
    },
    setInterest(state, action: { payload: number[] }) {
      state.interestRange = action.payload
    },
    setDuration(state, action: { payload: number[] }) {
      state.durationRange = action.payload
    },
  },
})

import { FilterSection } from '@banco/components'

export const FILTER_SECTIONS: FilterSection[] = [
  {
    name: 'PRINCIPAL AMOUNT',
    children: [
      {
        type: 'range',
        props: {
          name: 'amount',
          value: initialState.principalAmountRange,
          setValue: actions.setPrincipalAmount,
          min: initialState.principalAmountMin,
          max: initialState.principalAmountMax,
        },
      },
    ],
  },
  {
    name: 'INTEREST',
    children: [
      {
        type: 'range',
        props: {
          name: 'amount',
          value: initialState.interestRange,
          setValue: actions.setInterest,
          min: initialState.interestMin,
          max: initialState.interestMax,
        },
      },
    ],
  },
  {
    name: 'DURATION',
    children: [
      {
        type: 'range',
        props: {
          name: 'amount',
          value: initialState.durationRange,
          setValue: actions.setDuration,
          min: initialState.durationMin,
          max: initialState.durationMax,
        },
      },
    ],
  },
]
