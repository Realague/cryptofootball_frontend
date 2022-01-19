import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { Divider, Stack } from '@mui/material'
import footballHeroesService from '../../services/FootballPlayerService'
import Frame from '../../enums/Frame'
import Position from '../../enums/Position'
import MarketplaceContent from './components/MarketplaceContent'
import FilterButton from './components/FilterButton'

const MarketplacePage = () => {
	const [marketItems, setMarketItems] = useState([])
	const frames = Frame.TierList.slice().reverse()
	const [filters, setFilters] = useState({
		frames: frames.map(f => f.id),
		positions: Position.Positions.map(p => p.id),
	})
	const [lowestHighestPrice, setLowestHighestPrice] = useState(undefined)

	useEffect(() => {
		getMarketItems()
	}, [])

	const getMarketItems = async () => {
		let marketItemsId = await footballHeroesService.getPlayerForSaleFiltered([0, 1, 2, 3, 4], 0, 100, 0, '100000000000000000000000', false)
		let marketItems = []
		const lowestHighestPrices = [undefined, undefined]
		for (let i = 0; i !== marketItemsId.length; i++) {
			let marketItem = await footballHeroesService.getMarketItem(marketItemsId[i])
			const data = {
				player: await footballHeroesService.getFootballPlayer(marketItem.tokenId),
				marketItem: marketItem
			}
			const price = +Web3.utils.fromWei(marketItem.price, 'ether')
			if (lowestHighestPrices[0] === undefined || lowestHighestPrices[0] > price) {
				lowestHighestPrices[0] = price
			}
			if (lowestHighestPrices[1] === undefined || lowestHighestPrices[1] < price) {
				lowestHighestPrices[1] = price
			}
			marketItems.push(data)
		}
		setLowestHighestPrice(lowestHighestPrices)
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
					position: 'fixed'
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
			<MarketplaceContent filters={filters} marketItems={marketItems} lowestHighestPrice={lowestHighestPrice}/>
		</Stack>
	)
}

export default MarketplacePage
