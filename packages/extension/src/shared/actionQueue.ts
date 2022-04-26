import type { Abi, Call, InvocationsDetails, typedData } from "starknet"

import type { ExtQueueItem } from "../background/actionQueue"

export type ActionItem =
  | {
      type: "CONNECT_DAPP"
      payload: {
        host: string
      }
    }
  | {
      type: "TRANSACTION"
      payload: {
        transactions: Call | Call[]
        abis?: Abi[]
        transactionsDetail?: InvocationsDetails
        code?: string
      }
    }
  | {
      type: "SIGN"
      payload: typedData.TypedData
    }
  | {
      type: "ADD_TOKEN"
      payload: {
        address: string
        decimals?: string
        name?: string
        symbol?: string
        networkId?: string
      }
    }

export type ExtActionItem = ExtQueueItem<ActionItem>
