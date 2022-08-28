import { LoanDurationWindow } from 'src/generated_server'

export const getShortenedWalletAddress = (walletAddress: string) => {
  return `${walletAddress.slice(2, 6)}...${walletAddress.slice(-4)}`
}

export const getDaysFromDuration = (
  window: LoanDurationWindow,
  duration: number,
) => {
  switch (window) {
    case 'days':
      return duration
    case 'months':
      return duration * 30
    case 'years':
      return duration * 365
  }
}
