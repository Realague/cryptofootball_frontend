import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, Slide, Stack } from '@mui/material'
import Web3 from 'web3'
import LayoutContent from '../../../components/LayoutContent'
import Card from '../../../components/card/Card'
import footballHeroesService from '../../../services/FootballPlayerService'
import { useSelector } from 'react-redux'
import FilterRow from './FilterRow'

const MarketplaceContent = ({ filters, marketItems, lowestHighestPrice }) => {
	const { account, GBBalance } = useSelector(state => state.user)
	const [sortOption, setSortOption] = useState('score')
	const [sortDirection, setSortDirection] = useState('desc')
	const [priceRange, setPriceRange] = useState(undefined)

	useEffect(() => {
		if (priceRange === undefined && lowestHighestPrice !== undefined) {
			setPriceRange(lowestHighestPrice)
		}
	}, [lowestHighestPrice])

	const renderPlayers = () => {
		return priceRange !== undefined && marketItems
			.filter(i =>
				(
					filters.frames.includes(+i.player.frame)
                    && filters.positions.includes(+i.player.position)
                    && +Web3.utils.fromWei(i.marketItem.price, 'ether') >= priceRange[0]
                    && +Web3.utils.fromWei(i.marketItem.price, 'ether') <= priceRange[1]
				)
			)
			.sort((a, b) => {
				if (sortDirection === 'desc') {
					return parseFloat(b.player[sortOption]) - parseFloat(a.player[sortOption])
				} else {
					return parseFloat(a.player[sortOption]) - parseFloat(b.player[sortOption])
				}
			})
			.map((marketItem, idx) => (
				<Grid item m={2} p={2} display="flex" flexDirection="column" alignItems="center" width="240px" key={idx}>
					<Slide direction="up" appear={true} in={true}>
						<LayoutContent>
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
						</LayoutContent>
					</Slide>
				</Grid>
			))
	}

	return ( (marketItems && lowestHighestPrice) ?
		<Stack p={1} spacing={2} sx={{ width: '100%', marginLeft: '150px' }}>
			<FilterRow
				sortOption={sortOption}
				setSortOption={setSortOption}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
				lowestHighestPrice={lowestHighestPrice}
				priceRange={priceRange}
				setPriceRange={setPriceRange}
			/>
			<Divider variant="middle" flexItem/>
			<Grid container spacing={2} p={1}>
				{ renderPlayers() }
			</Grid>
		</Stack>
		:
		<Box>Loading</Box>
	)
}

export default MarketplaceContent
