export const getShortenedWalletAddress = (walletAddress: string) => {
  return `${walletAddress.slice(2, 6)}...${walletAddress.slice(-4)}`
}
