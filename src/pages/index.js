import { useState, useEffect } from 'react';
import Head from 'next/head';
import HomePage from '../components/HomePage';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ethers, providers } from 'ethers';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import Moralis from 'moralis';
import CONFIG, { SITE_ERROR } from '../../config'; 
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Header from '../components/Header';
import MobileFooter from '../components/MobileFooter';
import { errorAlert, errorAlertCenter } from '../components/toastGroup';
import { providerOptions } from '../hook/connectWallet';
import { checkNetwork } from '../hook/connectWallet';
import Modal from '../components/ChainSelectionModal';

let web3Modal = undefined

export default function Home({ headerAlert, closeAlert }) {

  const [totalReward, setTotalReward] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stakedCnt, setStakedCnt] = useState(0);
  const [unstakedCnt, setUnstakedCnt] = useState(0);
  const [connected, setConnected] = useState(false);
  const [signerAddress, setSignerAddress] = useState('');
  const [signerBalance, setSignerBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalDusty, setTotalDusty] = useState(0);
  const [staked, setStaked] = useState(0);
  const [earlyRemoved, setEarlyRemoved] = useState(0);
  const [dbalance, setdBalance] = useState(0);
  const [holders, setHolders] = useState(0);
  const [homeLoading, setHomeloading] = useState(false);
  const [ownerDusty, setTotalOwnerDusty] = useState(0);
  const [walletTypes, setWalletTypes] = useState(null);
  const [currentWalletType, setCurrentWalletType] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { CHAIN_ID, SMARTCONTRACT_ABI, SMARTCONTRACT_ABI_ERC20,
    SMARTCONTRACT_ADDRESS, SMARTCONTRACT_ADDRESS_ERC20, SOLANA_RPC_URL 
  } = CONFIG.BINANCE

  // Connects ethereum chain and set state variables
  const connectEthereumChain = async () => {
    try {
      web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });

      setHomeloading(true); // Start loading

      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setConnected(true);
      setSignerAddress(address);

      // Detect Ethereum network
      const network = await web3Provider.getNetwork();
      console.log(network, network.chainId)
      if (network.chainId === 1) {
        // Ethereum contracts interaction
        const contract = new ethers.Contract(
          SMARTCONTRACT_ADDRESS,
          SMARTCONTRACT_ABI,
          signer
        );

        const contract_20 = new ethers.Contract(
          SMARTCONTRACT_ADDRESS_ERC20,
          SMARTCONTRACT_ABI_ERC20,
          signer
        );

        const bal = await contract_20.balanceOf(address);
        setSignerBalance(ethers.utils.formatEther(bal));

        const totalS = await contract_20.totalSupply();
        setTotalSupply(ethers.utils.formatEther(totalS));

        const totlass = await contract_20.holders();
        setHolders(totlass.toString());

        const early = await contract.earlyRemoved();
        setEarlyRemoved(early.toString());

        const totalN = await contract_20.balanceOf(SMARTCONTRACT_ADDRESS);
        setTotalDusty(totalN.toString());

        const Obal = await contract.bonusPool();
        setTotalOwnerDusty(parseFloat(Obal.toString()) + parseFloat(1114));

        const sta = await contract.totalStaked();
        setStaked(sta.toString());

        setHomeloading(false); // Loading off for Ethereum

        // Subscribe to accounts and chain changes for Ethereum
        provider.on('accountsChanged', (accounts) => {
          setSignerAddress(accounts[0]);
        });

        provider.on('chainChanged', () => {
          window.location.reload();
        });

      } else {
        errorAlertCenter('Ethereum chain supported only.');
      }
    } catch (error) {
      console.error('Ethereum wallet connection error:', error);
      // errorAlertCenter('Error connecting Ethereum wallet.');
    }
  }


  // Connects solana chain and set state variables
  const connectSolanaChain = async () => {
    try {
      const phantomWallet = new PhantomWalletAdapter();
      await phantomWallet.connect();

      // Obtain the public key from the wallet
      const provider = window.phantom?.solana;
      const resp = await provider.connect();
      const publicKeyString = resp.publicKey.toString();
      
      // Convert the public key string to a PublicKey instance
      const publicKey = new PublicKey(publicKeyString);
      let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      
      setHomeloading(true); // Start loading for Solana

      // Fetch Solana balance
      const balance = await connection.getBalance(publicKey);
      setSignerBalance(balance / 1e9); // Convert lamports to SOL
      setSignerAddress(publicKeyString);
      setConnected(true);

      // Subscribe to account changes for Solana
      phantomWallet.on('accountChanged', (newPublicKey) => {
        if (newPublicKey) {
          setSignerAddress(newPublicKey.toString());
        } else {
          setSignerAddress(null);
        }
      });
      
      setHomeloading(false); // Loading off for Solana
    } catch (error) {
      console.error('Solana wallet connection error:', error);
      errorAlertCenter('Error connecting Solana wallet.');
    }
  }

  // connects chain based on currentWalletType
  const connectWallet = async (callWithNode = true) => {
    if(callWithNode) {
      setWalletTypes(null)
      checkNetwork().then((walletTypes) => { setWalletTypes(walletTypes)})
      return
    } 

    // Check for network
    if(typeof window.ethereum !== undefined && currentWalletType == 'ethereum') {
      await connectEthereumChain()
    } else if(typeof window.solana !== undefined && currentWalletType == 'solana') {   
      connectSolanaChain()
    }
  };
  
  // clear state variables and chache
  const disconnectWallet = async () => {
    try {
      if (currentWalletType === 'ethereum') {
        // Handle Ethereum disconnection
        if (web3Modal) {
          await web3Modal.clearCachedProvider(); // Clear cached provider
          setConnected(false);
          setSignerAddress('');
          setSignerBalance(0);
        }
      } else if (currentWalletType === 'solana') {
        // Handle Solana disconnection (Phantom, etc.)
        if (window.solana) {
          await window.solana.disconnect(); // Disconnect from Solana wallet
          setConnected(false);
          setSignerAddress('');
          setSignerBalance(0);
        }
      }

      window.location.reload().then(() => {
        openModal()
      })
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  const setStakedNFTs = async () => {
    try {
      // TODO: add ethereum configuration
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        SMARTCONTRACT_ADDRESS,
        SMARTCONTRACT_ABI,
        signer
      );
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.getAccounts();
      const total = await contract.staked(accounts[0]);
      if (parseInt(total.toString()) !== 0) {
        let dd = 0;
        let mmm = 0;
        for (let i = 0; i < total; i++) {
          const nftData = await contract.activities(accounts[0], i);
          if (nftData.action === 1) {
            dd++;
            mmm += parseFloat(ethers.utils.formatEther(nftData.reward.toString()));
          }
        }
        setStakedCnt(dd);
        setTotalReward(mmm);
      }
      setLoading(false);
    } catch(e) {
      console.log(e.message)
    }
  };

  const setPastNFTs = async () => {
    try {
      setLoading(true);
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.getAccounts();
      const userNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'bsc', address: accounts[0] });
      setUnstakedCnt(userNFTs.total);
      setLoading(false);
    } catch(e) {
      errorAlertCenter(e);
    }
  };

  const getNFTLIST = () => {
    setPastNFTs()
    setStakedNFTs()
  }

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle wallet selection from modal
  const handleSelectWallet = (walletType) => {
    setCurrentWalletType(walletType);
    closeModal();
  };

  useEffect(async () => {
    await connectWallet(false).then(() => {

      // TODO: implement logic for handling solana and ethereum chain stats
      if(currentWalletType && currentWalletType != 'solana') {
        getNFTLIST();

        ethereum.on('accountsChanged', function (accounts) {
          window.location.reload();
        });
        
        if (ethereum.selectedAddress !== null) {
          setSignerAddress(ethereum.selectedAddress);
          setConnected(true);
        }
        
        ethereum.on('chainChanged', (chainId) => {
          if (parseInt(chainId) === CHAIN_ID) {
            connectWallet(); // Reconnect to Ethereum wallet
          } else {
            setConnected(false);
            errorAlert(SITE_ERROR[0]);
          }
        });
      }
    });
  }, [currentWalletType])

  useEffect(() => {
    if (walletTypes && walletTypes.length > 1) 
      openModal()
  }, [walletTypes])

  useEffect(async () => {
    setWalletTypes(null)
    await checkNetwork().then(async (walletTypes) => {
      setWalletTypes(walletTypes)
    });

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header
        signerAddress={signerAddress}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        connected={connected}
        signerBalance={signerBalance}
        loading={homeLoading}
        headerAlert={headerAlert}
        closeAlert={closeAlert}
      />
      <MainContent>
        <Sidebar
          connected={connected}
          headerAlert={headerAlert}
        />
        <div className="page-content">
          <Head>
            <title>Dusty Vaults | Home</title>
            <meta name="description" content="NFT Bank" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <HomePage
            connected={connected}
            totalSupply={totalSupply}
            staked={staked}
            earlyRemoved={earlyRemoved}
            dbalance={dbalance}
            homeLoading={homeLoading}
            address={signerAddress}
            totalDusty={totalDusty}
            ownerDusty={ownerDusty}
            holders={holders}
            stakedCnt={stakedCnt}
            totalReward={totalReward}
            loading={loading}
            unstakedCnt={unstakedCnt}
          />

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            walletTypes={walletTypes}
            onSelectWallet={handleSelectWallet}
          />
        </div>
      </MainContent>
      <MobileFooter connected={connected} />
    </>
  )
}
