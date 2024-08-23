import  CONFIG, { SITE_ERROR } from "../../config"
import { errorAlert } from "../components/toastGroup"
import { getConnectProvider } from './ethereum';
import WalletConnectProvider from "@walletconnect/web3-provider";


const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

// Configure Ethereum provider options
export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID, // Ethereum provider
    },
  },
};

export const checkNetwork = async (alert = '') => {
  const walletTypes = []

  try {
    if (typeof window.ethereum !== 'undefined' && !window.phantom?.ethereum) {
      const { network } = await getConnectProvider()
      console.log(network)
      const ethereumChainId =  CONFIG.ETHEREUM.CHAIN_ID
      if (ethereumChainId == network.chainId)
        walletTypes.push('ethereum')
    } 
    
    if (typeof window.solana != 'undefined') {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) 
        walletTypes.push('solana')
    }

    console.log(walletTypes)
    return walletTypes
  } catch(e) {
    console.log('Error in network checking', e)

    if (alert !== "no-alert")
      errorAlert(SITE_ERROR[0])
    return false
  }
}