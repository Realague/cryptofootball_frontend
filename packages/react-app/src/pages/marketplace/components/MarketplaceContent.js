import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, Slide, Stack, useMediaQuery } from '@mui/material'
import Web3 from 'web3'
import LayoutContent from '../../../components/LayoutContent'
import Card from '../../../components/card/Card'
import footballHeroesService from '../../../services/FootballPlayerService'
import { useSelector } from 'react-redux'
import FilterRow from './FilterRow'
import { useTheme } from '@emotion/react'
import LoadingImage from '../../../images/gifs/loading.gif'

const MarketplaceContent = ({ filters, marketItems, lowestHighestPrice, lowestHighestScore, setShowLeftFilter, showLeftFilter }) => {
	const { account, GBBalance } = useSelector(state => state.user)
	const [sortOption, setSortOption] = useState('score')
	const [sortDirection, setSortDirection] = useState('desc')
	const [priceRange, setPriceRange] = useState(undefined)
	const [scoreRange, setScoreRange] = useState(undefined)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	useEffect(() => {
		if (!priceRange && lowestHighestPrice) {
			setPriceRange(lowestHighestPrice)
		}
		if (!scoreRange && lowestHighestScore) {
			setScoreRange(lowestHighestScore)
		}
	}, [lowestHighestPrice, lowestHighestScore])

	const renderPlayers = () => {
		return priceRange && scoreRange && marketItems
			.filter(i =>
				(
					filters.frames.includes(+i.player.frame)
                    && filters.positions.includes(+i.player.position)
                    && +Web3.utils.fromWei(i.marketItem.price, 'ether') >= priceRange[0]
                    && +Web3.utils.fromWei(i.marketItem.price, 'ether') <= priceRange[1]
					&& i.player.score >= scoreRange[0]
					&& i.player.score <= scoreRange[1]
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
						<Stack direction="column" alignItems="center">
							<Card mobile={isMobile} player={marketItem.player} marketItem={marketItem.marketItem}/>
							<Button
								disabled={
									Web3.utils.toWei(GBBalance, 'ether') < marketItem.marketItem.price
                                    || marketItem.marketItem.seller === account
								}
								sx={{ width: '100px' }}
								variant="contained" color="primary"
								onClick={() => footballHeroesService.buyPlayer(marketItem.marketItem)}
							>
								{Web3.utils.fromWei(marketItem.marketItem.price, 'ether')} $GB
							</Button>
						</Stack>
					</Slide>
				</Grid>
			))
	}

	const LoadingContent = (
		<Box display="flex" justifyContent="center" width="100%" height="80vh" alignItems="center">
			<img style={{ width: 400, height: 200 }} src={LoadingImage} alt=""/>
		</Box>
	)

	return ( (marketItems && lowestHighestPrice && lowestHighestScore) ?
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
				lowestHighestScore={lowestHighestScore}
				scoreRange={scoreRange}
				setScoreRange={setScoreRange}
				setShowLeftFilter={setShowLeftFilter}
				showLeftFilter={showLeftFilter}
			/>
			<Divider variant="middle" flexItem/>
			<Grid container justifyContent="space-around" display="flex" spacing={isMobile ? 0 : 2} p={1}>
				{ renderPlayers() }
			</Grid>
		</Stack>
		:
		LoadingContent
	)
}

export default MarketplaceContent
