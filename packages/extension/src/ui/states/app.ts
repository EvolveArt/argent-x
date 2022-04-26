import create from "zustand"

import { defaultNetwork } from "../../shared/networks"

interface State {
  switcherNetworkId: string
  error?: string
  passwordError?: string
  isLoading: boolean
  isFirstRender: boolean
  phoneNumber?: string
}

export const useAppState = create<State>(() => ({
  switcherNetworkId: defaultNetwork.id,
  isLoading: true,
  isFirstRender: true,
}))
