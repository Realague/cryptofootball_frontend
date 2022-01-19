import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, Slide, Stack, useMediaQuery } from '@mui/material'
import Web3 from 'web3'
import LayoutContent from '../../../components/LayoutContent'
import Card from '../../../components/card/Card'
import footballHeroesService from '../../../services/FootballPlayerService'
import { useSelector } from 'react-redux'
import FilterRow from './FilterRow'
import { useTheme } from '@emotion/react'

const MarketplaceContent = ({ filters, marketItems, lowestHighestPrice, setShowLeftFilter, showLeftFilter }) => {
	const { account, GBBalance } = useSelector(state => state.user)
	const [sortOption, setSortOption] = useState('score')
	const [sortDirection, setSortDirection] = useState('desc')
	const [priceRange, setPriceRange] = useState(undefined)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
				<Grid
					item
					m={isMobile ? 0 : 2}
					p={isMobile ? 0 : 2}
					display="flex"
					flexDirection="column"
					alignItems="center"
					key={idx}
				>
					<Slide direction="up" appear={true} in={true}>
						<LayoutContent>
							<Card mobile={isMobile} player={marketItem.player} marketItem={marketItem.marketItem}/>
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
		<Stack
			p={1}
			width="100%"
			spacing={2}
			sx={{
				marginLeft:  isMobile ? showLeftFilter ?  '150px' : '0px' : '150px',
				overflow: isMobile ? 'scroll' : 'hidden',
			}}>
			<FilterRow
				sortOption={sortOption}
				setSortOption={setSortOption}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
				lowestHighestPrice={lowestHighestPrice}
				priceRange={priceRange}
				setPriceRange={setPriceRange}
				setShowLeftFilter={setShowLeftFilter}
				showLeftFilter={showLeftFilter}
			/>
			<Divider variant="middle" flexItem/>
			<Grid container justifyContent="space-around" display="flex" spacing={isMobile ? 0 : 2} p={1}>
				{ renderPlayers() }
			</Grid>
		</Stack>
		:
		<Box>Loading</Box>
	)
}

export default MarketplaceContent
