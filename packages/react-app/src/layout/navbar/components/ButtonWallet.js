import React, {useEffect, useState} from 'react'
import {abis, addresses} from '@project/contracts'
import Web3 from 'web3'
import GameContract from '../../../contractInteraction/GameContract'
import FootballPlayerContract from '../../../contractInteraction/FootballPlayerContract'
import MarketplaceContract from '../../../contractInteraction/MarketplaceContract'
import {Button} from '@mui/material'
import {useDispatch} from 'react-redux'
import {login, updateAccount} from '../../../features/userSlice'
import Contract from 'web3-eth-contract'

const networkData =
    [{
    	chainId: '0x61',
    	chainName: 'BSCTESTNET',
    	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    	nativeCurrency: {
    		name: 'BINANCE COIN',
    		symbol: 'BNB', decimals: 18,
    	},
    	blockExplorerUrls: ['https://testnet.bscscan.com/'],
    }]

const CHAIN_ID = 0x61

const WalletButton = ({provider, loadWeb3Modal, logoutOfWeb3Modal}) => {
	const [rendered, setRendered] = useState('')
	const dispatch = useDispatch()

	function saveLoginInfos(account) {
		dispatch(login(account))
	}

	function saveAccountInfo(GBPrice, rewards, claimFee, GBBalance, BUSDBalance, playersId) {
		dispatch(updateAccount({
			GBPrice: GBPrice,
			rewards: rewards,
			claimFee: claimFee,
			GBBalance: GBBalance,
			BUSDBalance: BUSDBalance,
			playersId: playersId
		}))
	}

	async function readOnChainData(account) {
		let contract = new Contract(abis.erc20, addresses.BUSDTestnet)
		let BUSDBalance = await contract.methods.balanceOf(account).call()
		BUSDBalance = Web3.utils.fromWei(BUSDBalance)
		contract = new Contract(abis.erc20, addresses.GBTOKEN)
		let GBBalance = await contract.methods.balanceOf(account).call()
		GBBalance = Web3.utils.fromWei(GBBalance)
		let GBPrice = await GameContract.getFootballTokenPrice()
		let claimFee = await GameContract.getClaimFee(account)
		let rewards = await GameContract.getRewards(account)
		let playersId = await FootballPlayerContract.getFootballPlayerList(account)
		saveAccountInfo(GBPrice, rewards, claimFee, GBBalance, BUSDBalance, playersId)
	}

	useEffect(() => {

		async function fetchAccount() {
			try {
				if (!provider) {
					return
				}
				if (GameContract.getContract()) {
					return
				}

				const accounts = await provider.eth.getAccounts()
				Contract.setProvider(provider, accounts[0])
				GameContract.setProvider(provider, accounts[0])
				FootballPlayerContract.setProvider(provider, accounts[0])
				MarketplaceContract.setProvider(provider, accounts[0])

				// Subscribe to accounts change
				provider.currentProvider.on('accountsChanged', (accounts) => {
					saveLoginInfos(accounts[0])
					readOnChainData(accounts[0])
					setRendered(accounts[0].substring(0, 6) + '...' + accounts[0].substring(36))
				})

				// Subscribe to chainId change
				provider.currentProvider.on('chainChanged', (chainId) => {
					console.log(chainId)
					if (chainId !== networkData[0].chainId) {
						window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: networkData
						})
					}
				})

				let chainId = await provider.eth.getChainId()
				if (CHAIN_ID !== chainId) {
					window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: networkData
					})
				}

				setRendered(accounts[0].substring(0, 6) + '...' + accounts[0].substring(36))
				saveLoginInfos(accounts[0])
				readOnChainData(accounts[0])
			} catch (err) {
				setRendered('')
				logoutOfWeb3Modal()
				console.error(err)
			}
		}

		fetchAccount()
	}, [provider, setRendered])

	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={() => {
				if (!provider) {
					loadWeb3Modal()
				} else {
					logoutOfWeb3Modal()
				}
			}}
		>
			{rendered === '' && 'Connect Wallet'}
			{rendered !== '' && rendered}
		</Button>
	)
}

export default WalletButton
