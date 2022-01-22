import React, { createRef, forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from './card/Card'
import MintButton from './MintButton'
import LoadingImage from '../images/gifs/loading.gif'
import {
	Box, Chip,
	Divider,
	Grid,
	Grow,
	MenuItem,
	Paper,
	Select,
	Slide,
	Stack,
	Tab,
	Tabs,
	Typography,
	useMediaQuery
} from '@mui/material'
import Frame from '../enums/Frame'
import Button from '@mui/material/Button'
import { ArrowDropDown, ArrowDropUp, FilterAlt, FilterAltOff } from '@mui/icons-material'
import Position from '../enums/Position'
import { useTheme } from '@emotion/react'
import DraggableBox from './draggableBox/DraggableBox'
import { ItemTypes } from './Constants'
import footballHeroesService from '../services/FootballPlayerService'
import LayoutContent from './LayoutContent'
import { theme } from '../theme'
import { setCollection } from '../features/gameSlice'

const FootballPlayerCollection = () => {
	const { playersId } = useSelector(state => state.user)
	const [showAllPlayer, setShowAllPlayer] = useState(true)
	const [players, setPlayers] = useState([])
	const [playersForSale, setPlayersForSale] = useState([])
	const [marketItems, setMarketItems] = useState([])
	const [tabValue, setTabValue] = useState(1)
	const [isFetchingData, setIsFetchingData] = useState(false)
	const frames = Frame.TierList.slice().reverse()
	const [sortOption, setSortOption] = useState('score')
	const [sortDirection, setSortDirection] = useState('desc')
	const ref = createRef()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [showLeftFilter, setShowLeftFilter] = useState(false)
	const dispatch = useDispatch()

	const handleSortChange = (event) => {
		setSortOption(event.target.value)
	}

	useEffect(() => {
		console.log('oui')
		setIsFetchingData(true)
		Promise.all([getPlayers(), getPlayersListed()])
			.finally(() => setIsFetchingData(false))
	}, [])

	const getPlayers = async () => {
		let players = []
		for (let playerId of playersId) {
			players.push(await footballHeroesService.getFootballPlayer(playerId))
		}
		dispatch(setCollection(players))
		setPlayers(players)
	}

	const getPlayersListed = async () => {
		let marketItemsId = await footballHeroesService.getListedPlayerOfAddress()
		for (let i = 0; i !== marketItemsId.length; i++) {
			let marketItem = await footballHeroesService.getMarketItem(marketItemsId[i])
			marketItems.push(marketItem)
			players.push(await footballHeroesService.getFootballPlayer(marketItem.tokenId))
		}
		setPlayersForSale(players)
		setMarketItems(marketItems)
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
	}

	const TabPanel = ({ children, value, index, ...other }) => {
		return (
			<Box
				role="tabpanel"
				hidden={value !== index}
				{...other}
				sx={{
					width: '100%',
					marginLeft: (isMobile && showLeftFilter) ? '150px' : isMobile ? '0px' : '150px',
				}}
			>
				{value === index && (
					<Box sx={{
						p: 2,
					}}>
						{children}
					</Box>
				)}
			</Box>
		)
	}

	const LoadingContent = (
		<Box display="flex" justifyContent="center" width="100%" height="80vh" alignItems="center">
			<img style={{ width: 400, height: 200 }} src={LoadingImage} alt=""/>
		</Box>
	)

	const renderPlayer = (
		filter = undefined,
		isSell = false,
		sortMethod = (a, b) => parseFloat(b.id) - parseFloat(a.id),
		filterProperty = 'frame',
	) => {
		return (
			<>
				{ !isSell &&
                    <Stack direction="column" spacing={isMobile ? 1 : 2}>
                    	<Stack
                    		display="flex"
                    		direction="row"
                    		alignItems="center"
                    		spacing={2}
                    		sx={{
                    			height: '30px',
                    		}}
                    	>
                    		{
                    			isMobile &&
									<Button
										variant="contained"
										color="secondary"
										onClick={() => setShowLeftFilter(!showLeftFilter)}
									>
										{
											showLeftFilter ? <FilterAltOff/> : <FilterAlt/>

										}
									</Button>
                    		}
                    		<Typography variant="subtitle1">Sort:</Typography>
                    		<Select
                    			value={sortOption}
                    			label="Sort"
                    			color="secondary"
                    			onChange={handleSortChange}
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
                    	<Divider flexItem color="primary"/>
                    </Stack>
				}
				<Grid
					container
					pt={isMobile ? 1 : 2}
					spacing={0}
					display={'flex'}
					justifyContent={isMobile ? showLeftFilter ? 'center' : 'space-around' : ''}
				>
					{
						isFetchingData ?
							LoadingContent  :
							isSell ?
								playersForSale.map((player, idx) => (
									<Grid item key={idx}>
										<Slide direction="up" appear={true} in={true}>
											<LayoutContent
												ref={ref}>
												<Card
													mobile={isMobile}
													player={player}
													marketItem={marketItems[idx]}
												/>
											</LayoutContent>
										</Slide>
									</Grid>
								))
								:
								players
									.filter(p => filter === undefined ? true : p[filterProperty] == filter)
									.sort(sortMethod)
									.map((player, idx) => (
										<Grid item key={idx}>
											<DraggableBox type={ItemTypes.PLAYER} item={player}>
												<Slide direction="up" appear={true} in={true}>
													<LayoutContent ref={ref}>
														<Card
															mobile={isMobile}
															player={!showAllPlayer && marketItems ? playersForSale : player}
															marketItem={!showAllPlayer && marketItems ? marketItems[idx] : undefined}
														/>
													</LayoutContent>
												</Slide>
											</DraggableBox>

										</Grid>
									))
					}
				</Grid>
			</>

		)
	}

	return (
		<Box sx={{ width: '100%', display: 'flex', height: '100%' }}>
			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={tabValue}
				onChange={handleTabChange}
				textColor="secondary"
				indicatorColor="secondary"
				scrollButtons={false}
				sx={{
					borderRight: 1,
					position: 'fixed',
					marginLeft: isMobile ? showLeftFilter ? '0px' : '-150px' : '0px',
					borderColor: 'divider',
					width: '150px',
					height: '80%',
					overflowY: 'scroll',
				}}
			>
				{
					[
						'Mint', 'All', 'Listed',
						{ name: 'Tier', disabled: true } , ...frames,
						{ name: 'Position', disabled: true } , ...Position.Positions
					].map((c, i) => (
						c === 'Mint' ?
							<Box key={i} p={2} display="flex" alignItems="center" justifyContent="center">
								<Button fullWidth variant="contained" onClick={() => setTabValue(0)}>Mint</Button>
							</Box>
							:
							<Tab
								value={i}
								key={i}
								label={c.name || c} disabled={c.disabled || false}
								sx={{
									textTransform: c.disabled ? 'uppercase' : 'none',
									backgroundColor: c.disabled ? theme.palette.background.paper : '',
								}}
							/>
					))
				}
			</Tabs>
			<TabPanel value={tabValue} index={0}>
				<MintButton>Mint</MintButton>
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				{
					renderPlayer(
						undefined,
						false,
						(a, b) => {
							if (sortDirection === 'desc') {
								return parseFloat(b[sortOption]) - parseFloat(a[sortOption])
							} else {
								return parseFloat(a[sortOption]) - parseFloat(b[sortOption])
							}
						}
					)
				}
			</TabPanel>
			<TabPanel value={tabValue} index={2}>
				<Grid container>
					{
						renderPlayer(undefined, true)
					}
				</Grid>
			</TabPanel>
			{
				frames.map((t, i) => (
					<TabPanel key={4 + i} value={tabValue} index={4 + i}>
						{
							renderPlayer(t.id)
						}
					</TabPanel>
				))
			}
			{
				Position.Positions.map((t, i) => (
					<TabPanel key={10 + i} value={tabValue} index={10 + i}>
						{
							renderPlayer(t.id, false,(a, b) => {
								if (sortDirection === 'desc') {
									return parseFloat(b[sortOption]) - parseFloat(a[sortOption])
								} else {
									return parseFloat(a[sortOption]) - parseFloat(b[sortOption])
								}
							} , 'position')
						}
					</TabPanel>
				))
			}
		</Box>
	)
}

export default FootballPlayerCollection
