import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred"
import { FC, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Account } from "../../Account"
import { useNfts } from "../../hooks/useNfts"
import { routes } from "../../routes"
import { ErrorBoundary } from "../ErrorBoundary"
import { Spinner } from "../Spinner"
import { P } from "../Typography"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  margin: 0 16px 0 16px;
`

const Header = styled.h2`
  font-weight: 600;
  font-size: 32px;
  line-height: 38.4px;
  margin-bottom: 25px;
  text-align: center;
`

const NftItem = styled.figure`
  display: inline-block;
  overflow: hidden;
  margin: 8px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  cursor: pointer;

  img {
    width: 148px;
    height: 148px;
    object-fit: cover;
  }

  figcaption {
    width: 148px;
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
    padding: 2px 10px 5px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

interface AccountNftsProps {
  account: Account
}

const Nfts: FC<AccountNftsProps> = ({ account }) => {
  const navigate = useNavigate()
  const { nfts = [] } = useNfts(account.address)

  return (
    <div>
      {nfts.length === 0 && (
        <P style={{ textAlign: "center" }}>No collectibles to show</P>
      )}
      {nfts.map((nft) => (
        <NftItem
          key={`${nft.contract_address}-${nft.token_id}`}
          onClick={() =>
            navigate(routes.accountNft(nft.contract_address, nft.token_id))
          }
        >
          <img src={nft.copy_image_url} />
          <figcaption>{nft.name}</figcaption>
        </NftItem>
      ))}
    </div>
  )
}

const NftsError: FC<AccountNftsProps> = ({ account }) => {
  // this is needed to keep swr mounted so it can retry the request
  useNfts(account.address, {
    suspense: false,
    errorRetryInterval: 30e3 /* 30 seconds */,
  })

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReportGmailerrorredIcon
        style={{
          color: "red",
          fontSize: "64px",
          marginBottom: "16px",
        }}
      />
      <h3>Seems like Play Oasis API is down...</h3>
    </div>
  )
}

export const AccountNfts: FC<AccountNftsProps> = ({ account }) => {
  return (
    <Container>
      <Header>Collectibles</Header>
      <ErrorBoundary fallback={<NftsError account={account} />}>
        <Suspense fallback={<Spinner size={64} style={{ marginTop: 40 }} />}>
          <Nfts account={account} />
        </Suspense>
      </ErrorBoundary>
    </Container>
  )
}
