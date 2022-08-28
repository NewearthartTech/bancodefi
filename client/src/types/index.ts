import { ALoan } from 'src/generated_server'

// global.d.ts
declare type SetState<T> =
  | React.Dispatch<React.SetStateAction<T>>
  | ((x: T) => void)
export interface ReactChildren {
  children?: React.ReactNode
}

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type LoanStatus = 'OPEN' | 'ACTIVE' | 'REPAID' | 'DEFAULTED'

export type Loan = ALoan & {}
