// Libs
/* -------------------------------------------------------------------------- */
export * from './FormState'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { reducer as form, actions as formActions } from './FormState'

// Store
/* -------------------------------------------------------------------------- */

export const store = configureStore({
  reducer: { form },
})

// Root State
/* -------------------------------------------------------------------------- */

export type RootState = ReturnType<typeof store.getState>

// Dispatch & Actions
/* -------------------------------------------------------------------------- */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const actions = {
  ...formActions,
}

// Selector
/* -------------------------------------------------------------------------- */

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
