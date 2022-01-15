import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {connect, useSelector} from 'react-redux'
import '../css/toggleButton.css'
import FootballPlayerContract from '../contractInteraction/FootballPlayerContract'
import Contract from 'web3-eth-contract'
import {abis, addresses} from '@project/contracts'
import Web3 from 'web3'
import Loader from './Loader'
import {Box, Button} from '@mui/material'

const MintButton = () => {
	const {
		account,
		provider,
		BUSDBalance,
		GBBalance,
		GBPrice,
	} = useSelector(state => state.user)
	const [showLoader, setShowLoader] = useState(false)
	const [showMint, setShowMint] = useState(false)
	const [player, setPlayer] = useState(undefined)
	const [transaction, setTransaction] = useState(undefined)

	useEffect(() => {

	}, [])

	const mint = async (account, gbTokenPrice, busdBalance, gbBalance) => {
		const mintPrice = await FootballPlayerContract.getMintPrice()
		const mintFees = await FootballPlayerContract.getMintFees()
		if (parseInt(Web3.utils.toWei(busdBalance, 'ether')) < parseInt(mintFees) && parseInt(Web3.utils.toWei(gbBalance, 'ether')) < mintPrice * gbTokenPrice) {
			return
		}
		let BUSDTestnet = new Contract(abis.erc20, addresses.BUSDTestnet)
		let GBToken = new Contract(abis.erc20, addresses.GBTOKEN)
		let busdAllowance = await BUSDTestnet.methods.allowance(account, addresses.FootballPlayers).call()
		let gbAllowance = await GBToken.methods.allowance(account, addresses.FootballPlayers).call()
		if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(Web3.utils.fromWei(mintFees))) {
			let transaction = BUSDTestnet.methods.approve(addresses.FootballPlayers, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
			setTransaction(transaction)
			await transaction
		}
		if (parseInt(Web3.utils.fromWei(gbAllowance)) < Web3.utils.fromWei((mintPrice * gbTokenPrice).toString())) {
			let transaction = GBToken.methods.approve(addresses.FootballPlayers, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
			setTransaction(transaction)
			await transaction
		}
		setTransaction({transaction: FootballPlayerContract.getContract().methods.mintPlayer().send({from: account})})
	}

	return (
		<Box className="navMenu" style={{clear: 'both'}}>
			<Button sx={{margin: '10px'}} variant="contained" color="primary"
				className="float-left" onClick={() => {
					mint(account, GBPrice, BUSDBalance, GBBalance)
				}}>Mint
			</Button>
		</Box>
	)
}

export default MintButton
