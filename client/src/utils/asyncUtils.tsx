import { AxiosError } from 'axios'
import { LoanStatus } from 'src/generated_server'

interface IAsyncResultBase {
  isLoading?: boolean
  loadingPrompt?: string
  error?: Error
}

export interface IAsyncResult<T> extends IAsyncResultBase {
  result?: T
}

export function ShowError({ error }: { error: Error | undefined }) {
  if (error == null) return <>&nbsp;</>

  let errStr = error.message ?? `failed :${error}`

  const axErr = error as AxiosError
  if (axErr?.response) {
    if (axErr?.response.status == 401) {
      //unAuthHandler.onUnAuthorized();
    }

    if (axErr?.response?.data?.message) {
      errStr = axErr?.response?.data?.message
    }
  }

  if (errStr.length > 150) {
    errStr = errStr.slice(0, 150)
  }

  return (
    <div className="py-2 text-center">
      <span className="text-danger" style={{ color: 'red' }}>
        {' '}
        {errStr}
      </span>
    </div>
  )
}

export const getStatusNumberByEnum = (status: LoanStatus) => {
  const STATUS_ENUMS = Object.values(LoanStatus)
  const ind = STATUS_ENUMS.findIndex((lStatus) => lStatus === status)

  return ind
}
