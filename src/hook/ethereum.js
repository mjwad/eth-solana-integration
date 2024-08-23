import Web3Modal from 'web3modal'
import { ethers, providers } from "ethers"
import CONFIG, { SITE_ERROR } from "../../config"
import { errorAlert, errorAlertCenter, successAlert } from "../components/toastGroup"
import { providerOptions } from './connectWallet'
require('../pages/api/hello')

export const importToken = () => {
  const SMARTCONTRACT_ADDRESS_ERC20 = CONFIG.ETHEREUM.SMARTCONTRACT_ADDRESS_ERC20

  if (typeof window.ethereum !== 'undefined') {
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: SMARTCONTRACT_ADDRESS_ERC20,
          symbol: '$Dusty',
          decimals: 0,
          image: 'https://dusty-vaults.vercel.app/logo32x32.png',
        },
      },
    })
      .then((success) => {
        if (success) {
          successAlert('$Dusty token has been successfully added to your wallet. Please check your wallet.')
        } else {
          throw new Error('Something went wrong.')
        }
      })
      .catch(console.error)
  } else {
    errorAlertCenter(SITE_ERROR[1])
  }
}

export const getConnectProvider = async () => {
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
  });
  const provider = await web3Modal.connect();
  const web3Provider = new providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  const network = await web3Provider.getNetwork();

  return {
    web3Modal,
    provider,
    web3Provider,
    signer,
    network
  };
}
