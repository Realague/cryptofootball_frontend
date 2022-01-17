import React, {useEffect, useState} from 'react'
import Web3 from 'web3'
import Card from '../card/Card'
import {Button, Grid, Stack} from '@mui/material'
import {useSelector} from 'react-redux'
import footballHeroesService from "../../services/FootballPlayerService";

const Marketplace = () => {
	const {account, GBBalance} = useSelector(state => state.user)
	const [marketItems, setMarketItems] = useState([])

	useEffect(() => {
		getMarketItems()
	}, [])

	const getMarketItems = async () => {
		let marketItemsId = await footballHeroesService.getPlayerForSaleFiltered([0, 1, 2, 3, 4], 0, 100, 0, '100000000000000000000000', false)
		let marketItems = []
		for (let i = 0; i !== marketItemsId.length; i++) {
			let marketItem = await footballHeroesService.getMarketItem(marketItemsId[i])
			marketItems.push({
				player: await footballHeroesService.getFootballPlayer(marketItem.tokenId),
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
								onClick={() => footballHeroesService.buyPlayer(marketItem.marketItem)}
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
