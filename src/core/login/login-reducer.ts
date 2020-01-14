import { buildReducer, FatReducer, memoizeReducer } from 'redux-keto'

import { EdgeUserInfo } from '../../types/types'
import { base58 } from '../../util/encoding'
import { RootAction } from '../actions'
import { RootState } from '../root-reducer'
import { searchTree } from './login'
import { LoginStash } from './login-stash'
import { WalletInfoFullMap } from './login-types'
import { findPin2Stash } from './pin2'
import { getRecovery2Key } from './recovery2'

export interface LoginStashMap {
  [username: string]: LoginStash
}

export interface LoginState {
  readonly apiKey: string
  readonly appId: string
  readonly deviceDescription: string | null
  readonly serverUri: string
  readonly stashes: LoginStashMap
  readonly localUsers: EdgeUserInfo[]
  readonly walletInfos: WalletInfoFullMap
}

export const login: FatReducer<
  LoginState,
  RootAction,
  RootState
> = buildReducer({
  apiKey(state = '', action: RootAction): string {
    return action.type === 'INIT' ? action.payload.apiKey : state
  },

  appId(state = '', action: RootAction): string {
    return action.type === 'INIT' ? action.payload.appId : state
  },

  deviceDescription(state = null, action: RootAction): string | null {
    return action.type === 'INIT' ? action.payload.deviceDescription : state
  },

  localUsers: memoizeReducer(
    (next: RootState) => next.login.appId,
    (next: RootState) => next.login.stashes,
    (appId: string, stashes: LoginStashMap): EdgeUserInfo[] => {
      const out: EdgeUserInfo[] = []
      for (const username in stashes) {
        const stashTree = stashes[username]
        const stash = searchTree(stashTree, stash => stash.appId === appId)

        const keyLoginEnabled =
          stash != null &&
          (stash.passwordAuthBox != null || stash.loginAuthBox != null)
        const pin2Stash = findPin2Stash(stashTree, appId)
        const recovery2Key = getRecovery2Key(stashTree)

        out.push({
          keyLoginEnabled,
          lastLogin: stashTree.lastLogin,
          pinLoginEnabled: pin2Stash != null,
          recovery2Key:
            recovery2Key != null ? base58.stringify(recovery2Key) : undefined,
          username
        })
      }
      return out
    }
  ),

  serverUri(state = '', action: RootAction): string {
    return action.type === 'INIT' ? action.payload.authServer : state
  },

  stashes(state = {}, action: RootAction): LoginStashMap {
    switch (action.type) {
      case 'INIT': {
        const out: LoginStashMap = {}

        // Extract the usernames from the top-level objects:
        for (const stash of action.payload.stashes) {
          if (stash.username != null) {
            const { username } = stash
            out[username] = stash
          }
        }

        return out
      }

      case 'LOGIN_STASH_DELETED': {
        const copy = { ...state }
        delete copy[action.payload]
        return copy
      }

      case 'LOGIN_STASH_SAVED': {
        const { username } = action.payload
        if (!username) throw new Error('Missing username')

        const out = { ...state }
        out[username] = action.payload
        return out
      }
    }
    return state
  },

  walletInfos(state, action: RootAction, next: RootState): WalletInfoFullMap {
    // Optimize the common case:
    if (next.accountIds.length === 1) {
      const id = next.accountIds[0]
      return next.accounts[id].walletInfos
    }

    const out = {}
    for (const accountId of next.accountIds) {
      const account = next.accounts[accountId]
      for (const id of Object.keys(account.walletInfos)) {
        const info = account.walletInfos[id]
        out[id] = info
      }
    }
    return out
  }
})