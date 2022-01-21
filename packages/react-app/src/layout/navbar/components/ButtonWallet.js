import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { login, updateAccount } from '../../../features/userSlice'
import useWeb3Modal from '../../../hooks/useWeb3Modal'
import { setReady } from '../../../features/settingsSlice'
import footballHeroesService from '../../../services/FootballPlayerService'

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

const WalletButton = () => {
	const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal()
	const [rendered, setRendered] = useState('')
	//const {isReady} = useSelector(state => state.game)
	const dispatch = useDispatch()

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

	async function readOnChainData() {
		let BUSDBalance = Web3.utils.fromWei(await footballHeroesService.getBusdBalance())
		let GBBalance = Web3.utils.fromWei(await footballHeroesService.getGbBalance())
		let GBPrice = await footballHeroesService.getFootballTokenPrice()
		let claimFee = await footballHeroesService.getClaimFee()
		let rewards = await footballHeroesService.getRewards()
		let playersId = await footballHeroesService.getFootballPlayerList()
		saveAccountInfo(GBPrice, rewards, claimFee, GBBalance, BUSDBalance, playersId)
	}

	async function fetchAccount() {
		try {
			dispatch(setReady(false))
			const accounts = await provider.eth.getAccounts()

			// Subscribe to accounts change
			provider.currentProvider.on('accountsChanged', (accounts) => {
				footballHeroesService.init(provider, accounts[0])
				dispatch(login(accounts[0]))
				readOnChainData()
				setRendered(accounts[0].substring(0, 6) + '...' + accounts[0].substring(36))
			})

			// Subscribe to chainId change
			provider.currentProvider.on('chainChanged', (chainId) => {
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
			footballHeroesService.init(provider, accounts[0])
			dispatch(login(accounts[0]))
			await readOnChainData()
		} catch (err) {
			setRendered('')
			logoutOfWeb3Modal()
			console.error('eee', err)
		} finally {
			dispatch(setReady(true))
		}
	}

	useEffect(() => {
		if (provider !== undefined) {
			fetchAccount()
		}
	}, [provider])

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
