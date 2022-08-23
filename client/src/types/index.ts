// global.d.ts
declare type SetState<T> =
  | React.Dispatch<React.SetStateAction<T>>
  | ((x: T) => void)
declare interface ReactChildren {
  children?: React.ReactNode
}

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type LoanStatus = 'OPEN' | 'ACTIVE' | 'REPAID' | 'DEFAULTED'

export type Loan = {
  loanID: string
  loanRequester: string
  requesterPFP: string
  collateralID: string
  collectionName: string
  principal: number
  interestRate: number
  duration: number
  bundled: boolean
  status: LoanStatus
  dueDate?: string
}
