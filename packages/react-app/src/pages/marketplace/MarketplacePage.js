import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { Divider, Stack, useMediaQuery } from '@mui/material'
import footballHeroesService from '../../services/FootballPlayerService'
import Frame from '../../enums/Frame'
import Position from '../../enums/Position'
import MarketplaceContent from './components/MarketplaceContent'
import FilterButton from './components/FilterButton'
import { useTheme } from '@emotion/react'

const MarketplacePage = () => {
	const [marketItems, setMarketItems] = useState([])
	const frames = Frame.TierList.slice().reverse()
	const [filters, setFilters] = useState({
		frames: frames.map(f => f.id),
		positions: Position.Positions.map(p => p.id),
	})
	const [lowestHighestPrice, setLowestHighestPrice] = useState(undefined)
	const [lowestHighestScore, setLowestHighestScore] = useState(undefined)

	// Mobile
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [showLeftFilter, setShowLeftFilter] = useState(false)

	useEffect(() => {
		getMarketItems()
	}, [])

	const getMarketItems = async () => {
		let marketItemsId = await footballHeroesService.getPlayerForSaleFiltered([0, 1, 2, 3, 4], 0, 100, 0, '100000000000000000000000', false)
		let marketItems = []
		const lowestHighestPrices = [undefined, undefined]
		const lowestHighestScores = [undefined, undefined]
		for (let i = 0; i !== marketItemsId.length; i++) {
			let marketItem = await footballHeroesService.getMarketItem(marketItemsId[i])
			const data = {
				player: await footballHeroesService.getFootballPlayer(marketItem.tokenId),
				marketItem: marketItem
			}
			const price = +Web3.utils.fromWei(marketItem.price, 'ether')
			if (!lowestHighestPrices[0] || lowestHighestPrices[0] > price) {
				lowestHighestPrices[0] = price
			}
			if (!lowestHighestPrices[1] || lowestHighestPrices[1] < price) {
				lowestHighestPrices[1] = price
			}
			const score = +data.player.score
			if (!lowestHighestScores[0] || lowestHighestScores[0] > score) {
				lowestHighestScores[0] = score
			}
			if (!lowestHighestScores[1] || lowestHighestScores[1] < score) {
				lowestHighestScores[1] = score
			}
			marketItems.push(data)
		}
		setLowestHighestPrice(lowestHighestPrices)
		setLowestHighestScore(lowestHighestScores)
		setMarketItems(marketItems)
	}

	return (
		<Stack direction="row">
			<Stack
				display="flex"
				alignItems="center"
				justifyContent="flex-start"
				width="150px"
				sx={{
					position: 'fixed',
					marginLeft: isMobile ? showLeftFilter ? '0px' : '-150px' : '0px',
				}}
			>
				<FilterButton filters={filters} setFilters={(v) => setFilters(v)} f={{ name: 'Tier', id: -1 }} disabled />
				<Divider flexItem variant={'middle'}/>
				{
					frames.map(f => (<FilterButton
						isSelected={filters['frames'].includes(f.id)}
						setFilters={(v) => setFilters(v)}
						type="frames"
						key={f.id}
						f={f}
					/>))
				}
				<FilterButton
					f={{ name: 'Positions', id: -1 }}
					disabled
				/>
				<Divider flexItem variant={'middle'}/>
				{
					Position.Positions.map(f => (
						<FilterButton
							type="positions"
							setFilters={(v) => setFilters(v)}
							isSelected={filters['positions'].includes(f.id)}
							key={f.id + frames.length}
							f={f} />))
				}
			</Stack>
			<MarketplaceContent
				setShowLeftFilter={setShowLeftFilter}
				showLeftFilter={showLeftFilter}
				filters={filters}
				marketItems={marketItems}
				lowestHighestPrice={lowestHighestPrice}
				lowestHighestScore={lowestHighestScore}
			/>
		</Stack>
	)
}

export default MarketplacePage
