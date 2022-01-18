import React, {useEffect, useState} from 'react'
import Web3 from 'web3'
import Card from '../../components/card/Card'
import {Box, Button, Divider, Grid, MenuItem, Select, Slide, Stack, Typography} from '@mui/material'
import {useSelector} from 'react-redux'
import footballHeroesService from '../../services/FootballPlayerService'
import Frame from '../../enums/Frame'
import {useTheme} from '@emotion/react'
import Position from '../../enums/Position'
import {ArrowDropDown, ArrowDropUp} from '@mui/icons-material'
import LayoutContent from '../../components/LayoutContent'

const MarketplacePage = () => {
	const {account, GBBalance} = useSelector(state => state.user)
	const [marketItems, setMarketItems] = useState([])
	const frames = Frame.TierList.slice().reverse()
	const [sortOption, setSortOption] = useState('score')
	const [sortDirection, setSortDirection] = useState('desc')
	const [filters, setFilters] = useState({
		frames: frames.map(f => f.id),
		positions: Position.Positions.map(p => p.id)
	})
	const theme = useTheme()

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

	const renderPlayers = () => {
		return marketItems
			.filter(i => (filters.frames.includes(+i.player.frame) && filters.positions.includes(+i.player.position)))
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

	const FilterButton = ({f, type = 'frames', disabled = false}) => {

		return (
			<Box
				key={f.id}
				sx={{
					padding: '15px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					borderRight: '2px solid',
					borderColor: filters[type].includes(f.id) ? theme.palette.secondary.main : theme.palette.background.default,
				}}
				onClick={() => {
					if (disabled) {
						return
					}
					const arr = filters[type]
					if (arr.includes(f.id)) {
						setFilters(prev => ({ ...prev, [type]: prev[type].filter(id => id !== f.id)}))
					} else {
						setFilters(prev => ({ ...prev, [type]: [...prev[type], f.id]}))
					}
				}}
			>
				<Typography
					variant={disabled ? 'subtitle2' : 'subtitle1'}
					color={ filters[type].includes(f.id) ? theme.palette.secondary.main : theme.palette.primary.contrastText}
				>{f.name}</Typography>
			</Box>
		)
	}

	return (
		<Stack direction="row">
			<Stack
				display="flex"
				alignItems="center"
				justifyContent="flex-start"
				width="150px"
			>
				<FilterButton f={{name: 'Tier', id: -1}} disabled />
				<Divider flexItem variant={'middle'}/>
				{
					frames.map(f => (<FilterButton type="frames" key={f.id} f={f} />))
				}
				<FilterButton f={{name: 'Positions', id: -1}} disabled />
				<Divider flexItem variant={'middle'}/>
				{
					Position.Positions.map(f => (
						<FilterButton
							type="positions"
							key={f.id + frames.length}
							f={f} />))
				}
			</Stack>
			<Stack p={1} spacing={2} sx={{ width: '100%' }}>
				<Stack
					display="flex"
					direction="row"
					alignItems="center"
					spacing={2}
					p={2}
					sx={{
						height: '30px',
					}}
				>
					<Typography variant="subtitle1">Sort:</Typography>
					<Select
						value={sortOption}
						label="Sort"
						color="secondary"
						onChange={(event) => {
							setSortOption(event.target.value)
						}}
						sx={{
							height: '30px',
							width: '100px',
						}}
					>
						<MenuItem value={'score'}>Score</MenuItem>
						<MenuItem value={'id'}>Id</MenuItem>
						<MenuItem value={'frame'}>Tier</MenuItem>
					</Select>
					<Button
						sx={{
							height: '30px',
							width: '70px',
						}}
						variant="outlined"
						color="secondary"
						endIcon={sortDirection === 'desc' ? <ArrowDropDown /> : <ArrowDropUp/>}
						onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
					>
						{ sortDirection }
					</Button>
				</Stack>
				<Divider variant="middle" flexItem/>
				<Grid container spacing={2} p={1}>
					{ renderPlayers() }
				</Grid>
			</Stack>
		</Stack>
	)
}

export default MarketplacePage
