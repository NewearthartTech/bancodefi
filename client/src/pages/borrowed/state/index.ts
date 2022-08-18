// Libs
/* -------------------------------------------------------------------------- */
export * from './FilterState'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { reducer as filter, actions as filterActions } from './FilterState'

// Store
/* -------------------------------------------------------------------------- */

export const store = configureStore({
  reducer: { filter },
})

// Root State
/* -------------------------------------------------------------------------- */

export type RootState = ReturnType<typeof store.getState>

// Dispatch & Actions
/* -------------------------------------------------------------------------- */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const actions = {
  ...filterActions,
}

// Selector
/* -------------------------------------------------------------------------- */

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
