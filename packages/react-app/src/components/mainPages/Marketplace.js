import AccountInfo from './AccountInfo'
import React, {useEffect, useState} from 'react'
import FootballPlayerContract from '../../contractInteraction/FootballPlayerContract'
import MarketplaceContract from '../../contractInteraction/MarketplaceContract'
import Web3 from 'web3'
import {abis, addresses} from '@project/contracts'
import Contract from 'web3-eth-contract'
import Loader from '../Loader'
import Card from '../card/Card'
import {Box, Button, Grid, Paper, Stack} from '@mui/material'
import {useSelector} from 'react-redux'


const Marketplace = () => {
	const {account, GBBalance} = useSelector(state => state.user)
	const [marketItems, setMarketItems] = useState([])
	const [transaction, setTransaction] = useState(undefined)

	useEffect(() => {
		getMarketItems()
	}, [])

	const buyPlayer = async (marketItem) => {
		//TODO check price in wei
		if (Web3.utils.toWei(GBBalance, 'ether') < marketItem.price) {
			return
		}

		let GBToken = new Contract(abis.erc20, addresses.GBTOKEN)
		let GBAllowance = await GBToken.methods.allowance(account, addresses.Marketplace).call()

		if (parseInt(GBAllowance) < marketItem.price) {
			let transaction = GBToken.methods.approve(addresses.Marketplace, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
			setTransaction(transaction)
			await transaction
		}
		setTransaction(MarketplaceContract.getContract().methods.buyPlayer(marketItem.itemId, marketItem.price).send({from: account}))
	}

	const getMarketItems = async () => {
		let marketItemsId = await MarketplaceContract.getPlayerForSaleFiltered([0, 1, 2, 3, 4], 0, 100, 0, '100000000000000000000000', false)
		let marketItems = []
		for (let i = 0; i !== marketItemsId.length; i++) {
			let marketItem = await MarketplaceContract.getMarketItem(marketItemsId[i])
			marketItems.push({
				player: await FootballPlayerContract.getFootballPlayer(marketItem.tokenId),
				marketItem: marketItem
			})
		}
		setMarketItems(marketItems)
	}


	return (
		<Stack direction="column" justifyContent="center" alignItems="center">
			<Grid container spacing={2}>
				{
					marketItems.map((marketItem, idx) => (
						<Grid item m={2} p={2} display="flex" flexDirection="column" alignItems="center" width="240px" key={idx}>
							<Card player={marketItem.player} marketItem={marketItem.marketItem}/>
							<Button
								disabled={
									Web3.utils.toWei(GBBalance, 'ether') < marketItem.marketItem.price
									|| marketItem.marketItem.seller === account
								}
								variant="contained" color="primary"
								onClick={() => buyPlayer(marketItem.marketItem)}
							>
								{Web3.utils.fromWei(marketItem.marketItem.price, 'ether')} $GB
							</Button>
						</Grid>
					))
				}
			</Grid>
		</Stack>
	)
}

export default Marketplace
