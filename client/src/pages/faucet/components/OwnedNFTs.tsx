import { Card } from '@banco/components'
import { Spinner } from '@chakra-ui/react'
import { OwnedNft } from 'alchemy-sdk'
import { IAsyncResult, ShowError } from 'src/utils/asyncUtils'

interface OwnedNfts {
  checkBalance: IAsyncResult<OwnedNft[]>
}

export const OwnedNfts = ({ checkBalance }: OwnedNfts) => {
  return (
    <Card width="100%">
      <h2>Owned NFTs</h2>

      {checkBalance?.isLoading && <Spinner />}

      {checkBalance?.error && <ShowError error={checkBalance.error} />}

      {(checkBalance?.result || []).map((nft, i) => (
        <div key={i}>
          <span style={{ marginRight: '1rem' }}>{nft.contract.address}</span>:
          <span style={{ marginLeft: '1rem' }}>{nft.tokenId}</span>
        </div>
      ))}
    </Card>
  )
}
