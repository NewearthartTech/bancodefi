// Libs
/* -------------------------------------------------------------------------- */

import { createSlice } from '@reduxjs/toolkit'
import { FilterSection } from '@banco/components'

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
  filterSections: FilterSection[]
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
  filterSections: [],
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

    setPrincipalAmountMax(state, action: { payload: number }) {
      state.principalAmountMax = action.payload
    },

    setPrincipalAmountMin(state, action: { payload: number }) {
      state.principalAmountMin = action.payload
    },
    setInterest(state, action: { payload: number[] }) {
      state.interestRange = action.payload
    },
    setInterestAmountMax(state, action: { payload: number }) {
      state.interestMax = action.payload
    },

    setInterestAmountMin(state, action: { payload: number }) {
      state.interestMin = action.payload
    },
    setDuration(state, action: { payload: number[] }) {
      state.durationRange = action.payload
    },

    setDurationMax(state, action: { payload: number }) {
      state.durationMax = action.payload
    },

    setDurationMin(state, action: { payload: number }) {
      state.durationMin = action.payload
    },
    setFilterSections(state, action: { payload: FilterSection[] }) {
      state.filterSections = action.payload
    },
  },
})

export const FILTER_SECTIONS: FilterSection[] = [
  {
    name: 'PRINCIPAL AMOUNT',
    children: [
      {
        type: 'range',
        props: {
          name: 'amount',
          getValue: (state: FilterState) => state.principalAmountRange,
          setValue: actions.setPrincipalAmount,
          getMin: (state: FilterState) => state.principalAmountMin,
          getMax: (state: FilterState) => state.principalAmountMax,
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

          getValue: (state: FilterState) => state.interestRange,
          setValue: actions.setInterest,
          getMin: (state: FilterState) => state.interestMin,
          getMax: (state: FilterState) => state.interestMax,
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
          getValue: (state: FilterState) => state.durationRange,
          setValue: actions.setDuration,
          getMin: (state: FilterState) => state.durationMin,
          getMax: (state: FilterState) => state.durationMax,
        },
      },
    ],
  },
]
