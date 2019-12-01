// @flow

import {
  type EdgeCorePlugin,
  type EdgeCorePluginsInit,
  type EdgeCurrencyTools,
  type EdgePluginMap,
  type EdgeTokenInfo,
  type EdgeWalletInfo,
  type EdgeWalletStates
} from '../types/types.js'
import { type SwapSettings } from './account/account-reducer.js'
import {
  type TxFileJsons,
  type TxFileNames
} from './currency/wallet/currency-wallet-reducer.js'
import { type ExchangePair } from './exchange/exchange-reducer.js'
import { type LoginStash } from './login/login-types.js'
import {
  type StorageWalletState,
  type StorageWalletStatus
} from './storage/storage-reducer.js'

export type RootAction =
  | {
      // The account fires this when the user sorts or archives wallets.
      type: 'ACCOUNT_CHANGED_WALLET_STATES',
      payload: {
        accountId: string,
        walletStates: EdgeWalletStates
      }
    }
  | {
      // The account fires this when it loads its keys from disk.
      type: 'ACCOUNT_KEYS_LOADED',
      payload: {
        accountId: string,
        legacyWalletInfos: EdgeWalletInfo[],
        walletStates: EdgeWalletStates
      }
    }
  | {
      // The account encountered an error when initializing itself.
      type: 'ACCOUNT_LOAD_FAILED',
      payload: {
        accountId: string,
        error: Error
      }
    }
  | {
      // Fired when somebody changes the currency settings for a plugin.
      type: 'ACCOUNT_PLUGIN_SETTINGS_CHANGED',
      payload: {
        accountId: string,
        pluginName: string,
        userSettings: Object
      }
    }
  | {
      // Fires when we load plugin settings from disk.
      type: 'ACCOUNT_PLUGIN_SETTINGS_LOADED',
      payload: {
        accountId: string,
        userSettings: EdgePluginMap<Object>,
        swapSettings: EdgePluginMap<SwapSettings>
      }
    }
  | {
      // Fired when somebody enables or disables swap plugins.
      type: 'ACCOUNT_SWAP_SETTINGS_CHANGED',
      payload: {
        accountId: string,
        pluginName: string,
        swapSettings: SwapSettings
      }
    }
  | {
      // Somebody just added a custom token type to the wallet.
      type: 'ADDED_CUSTOM_TOKEN',
      payload: EdgeTokenInfo
    }
  | {
      // Shuts down the context and all its objects.
      type: 'CLOSE'
    }
  | {
      // Called when new plugins become available.
      type: 'CORE_PLUGINS_ADDED',
      payload: EdgePluginMap<EdgeCorePlugin>
    }
  | {
      // Called when the plugin list becomes final.
      type: 'CORE_PLUGINS_LOCKED'
    }
  | {
      // Called when a currency engine fires the onBalanceChanged callback.
      type: 'CURRENCY_ENGINE_CHANGED_BALANCE',
      payload: {
        balance: string,
        currencyCode: string,
        walletId: string
      }
    }
  | {
      // Called when a currency engine fires the onBlockHeightChanged callback.
      type: 'CURRENCY_ENGINE_CHANGED_HEIGHT',
      payload: {
        height: number,
        walletId: string
      }
    }
  | {
      // Called when a currency engine returns the display private & public seeds.
      type: 'CURRENCY_ENGINE_CHANGED_SEEDS',
      payload: {
        displayPublicSeed: string | null,
        displayPrivateSeed: string | null,
        walletId: string
      }
    }
  | {
      // Called when a currency engine fires the onAddressChecked callback.
      type: 'CURRENCY_ENGINE_CHANGED_SYNC_RATIO',
      payload: {
        ratio: number,
        walletId: string
      }
    }
  | {
      // Called when a currency engine fires the onTransactionsChanged callback.
      type: 'CURRENCY_ENGINE_CHANGED_TXS',
      payload: {
        txs: any[],
        walletId: string,
        txidHashes: any
      }
    }
  | {
      type: 'CURRENCY_ENGINE_GOT_TXS',
      payload: {
        walletId: string,
        currencyCode: string
      }
    }
  | {
      // Called when a currency engine is wiped out.
      type: 'CURRENCY_ENGINE_CLEARED',
      payload: {
        walletId: string
      }
    }
  | {
      // Called when a currency engine dies at creation time.
      type: 'CURRENCY_ENGINE_FAILED',
      payload: {
        error: Error,
        walletId: string
      }
    }
  | {
      // Called when a currency engine begins connecting to the network.
      type: 'CURRENCY_ENGINE_STARTED',
      payload: {
        walletId: string
      }
    }
  | {
      // Called when a currency engine finishes shutting down its networking.
      type: 'CURRENCY_ENGINE_STOPPED',
      payload: {
        walletId: string
      }
    }
  | {
      // Called when the core finishes loading currency tools:
      type: 'CURRENCY_TOOLS_LOADED',
      payload: {
        pluginName: string,
        tools: Promise<EdgeCurrencyTools>
      }
    }
  | {
      // Called when a currency wallet receives a new name.
      type: 'CURRENCY_WALLET_FIAT_CHANGED',
      payload: {
        fiatCurrencyCode: string,
        walletId: string
      }
    }
  | {
      // Called when a currency wallet's individual transaction metadata has changed.
      type: 'CURRENCY_WALLET_FILE_CHANGED',
      payload: {
        creationDate: number,
        fileName: string,
        json: Object,
        txid: string,
        txidHash: string,
        walletId: string
      }
    }
  | {
      // Called when a currency wallet's files have been loaded from disk.
      type: 'CURRENCY_WALLET_FILES_LOADED',
      payload: {
        files: TxFileJsons,
        walletId: string
      }
    }
  | {
      // Called when a currency wallet's file names have been loaded from disk.
      type: 'CURRENCY_WALLET_FILE_NAMES_LOADED',
      payload: {
        txFileNames: TxFileNames,
        walletId: string
      }
    }
  | {
      // Called when a currency wallet receives a new name.
      type: 'CURRENCY_WALLET_NAME_CHANGED',
      payload: {
        name: string | null,
        walletId: string
      }
    }
  | {
      // Called when a currency wallet derives its public keys.
      type: 'CURRENCY_WALLET_PUBLIC_INFO',
      payload: {
        walletId: string,
        walletInfo: EdgeWalletInfo
      }
    }
  | {
      // Fired when we fetch exchange pairs from some server.
      type: 'EXCHANGE_PAIRS_FETCHED',
      payload: ExchangePair[]
    }
  | {
      // Initializes the redux store on context creation.
      type: 'INIT',
      payload: {
        apiKey: string,
        appId: string,
        authServer: string,
        hideKeys: boolean,
        pluginsInit: EdgeCorePluginsInit,
        stashes: { [path: string]: Object }
      }
    }
  | {
      // Fires when a user logs in.
      type: 'LOGIN',
      payload: {
        appId: string,
        loginKey: Uint8Array,
        loginType: string,
        rootLogin: boolean,
        username: string
      }
    }
  | {
      // Fires when we delete login data from disk.
      type: 'LOGIN_STASH_DELETED',
      payload: string // username
    }
  | {
      // Fires when we write a login stash to disk.
      type: 'LOGIN_STASH_SAVED',
      payload: LoginStash
    }
  | {
      // Fires when a user logs out.
      type: 'LOGOUT',
      payload: { accountId: string }
    }
  | {
      // Pause / unpause background work.
      type: 'PAUSE',
      payload: boolean
    }
  | {
      // Fires when a storage wallet has been loaded.
      type: 'STORAGE_WALLET_ADDED',
      payload: {
        id: string,
        initialState: StorageWalletState
      }
    }
  | {
      // Fires when a repo has been synced.
      type: 'STORAGE_WALLET_SYNCED',
      payload: {
        id: string,
        changes: string[],
        status: StorageWalletStatus
      }
    }
