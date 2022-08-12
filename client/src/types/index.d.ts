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
