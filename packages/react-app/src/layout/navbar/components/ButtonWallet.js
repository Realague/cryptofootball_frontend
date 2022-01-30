import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { login, updateAccount } from '../../../features/userSlice'
import useWeb3Modal from '../../../hooks/useWeb3Modal'
import { setContractState, setReady } from '../../../features/settingsSlice'
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

	function saveAccountInfo(GBPrice, GBExactPrice, rewards, claimFee, GBBalance, BUSDBalance, playersId) {
		dispatch(updateAccount({
			GBPrice: GBPrice,
			GBExactPrice: GBExactPrice,
			rewards: rewards,
			claimFee: claimFee,
			GBBalance: GBBalance,
			BUSDBalance: BUSDBalance,
			playersId: playersId
		}))
	}

	async function readOnChainData() {
		const jobs  = []
		jobs.push(footballHeroesService.getFootballTokenPrice())
		jobs.push(footballHeroesService.getGBExactPrice())
		jobs.push(footballHeroesService.getRewards())
		jobs.push(footballHeroesService.getClaimFee())
		jobs.push(footballHeroesService.getGbBalance())
		jobs.push(footballHeroesService.getBusdBalance())
		jobs.push(footballHeroesService.getFootballPlayerList())
		const jobsResult = await Promise.all(jobs)
		saveAccountInfo(
			jobsResult[0],
			Web3.utils.fromWei(jobsResult[1]), // GB Exact price
			jobsResult[2],
			jobsResult[3],
			Web3.utils.fromWei(jobsResult[4]), // GB Balance
			Web3.utils.fromWei(jobsResult[5]), // BUSD Balance
			jobsResult[6]
		)
	}

	async function getContractState() {
		const jobs = []
		jobs.push(footballHeroesService.isMarketplaceOpen())
		jobs.push(footballHeroesService.isMintOpen())
		jobs.push(footballHeroesService.isLevelUpOpen())
		jobs.push(footballHeroesService.isTrainingOpen())
		jobs.push(footballHeroesService.isFootballMatchOpen())
		jobs.push(footballHeroesService.isUpgradeFrameOpen())
		const jobsResult = await Promise.all(jobs)
		dispatch(setContractState({
			isMarketplaceOpen: jobsResult[0],
			isMintOpen: jobsResult[1],
			isLevelUpOpen: jobsResult[2],
			isTrainingOpen: jobsResult[3],
			isMatchOpen: jobsResult[4],
			isUpgradeFrameOpen: jobsResult[5]
		}))
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
			await Promise.all([readOnChainData(), getContractState()])
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
