import React, { createRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from './card/Card'
import MintButton from './MintButton'
import LoadingImage from '../images/gifs/loading.gif'
import LoadingButton from '@mui/lab/LoadingButton'
import {
	Box,
	Divider,
	Grid, Icon,
	MenuItem,
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
import { ArrowDropDown, ArrowDropUp, FilterAlt, FilterAltOff, Refresh } from '@mui/icons-material'
import Position from '../enums/Position'
import { useTheme } from '@emotion/react'
import DraggableBox from './draggableBox/DraggableBox'
import { ItemTypes } from './Constants'
import LayoutContent from './LayoutContent'
import { fetchData } from '../features/gameSlice'

const FootballPlayerCollection = ({ isTrainingPage = false }) => {
	const { collection, marketItems, playersForSale, fetching } = useSelector(state => state.game)
	const [showAllPlayer, setShowAllPlayer] = useState(true)
	const [tabValue, setTabValue] = useState(1)
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
				{!isSell &&
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
                    			endIcon={sortDirection === 'desc' ? <ArrowDropDown/> : <ArrowDropUp/>}
                    			onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                    		>
                    			{sortDirection}
                    		</Button>
                    		<LoadingButton
                    			sx={{
                    				height: '30px',
                    				width: '70px',
                    			}}
                    			loading={fetching}
                    			variant="contained"
                    			color="secondary"
                    			onClick={() => dispatch(fetchData())}
                    		>
                    			<Refresh/>
                    		</LoadingButton>
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
						fetching ?
							LoadingContent :
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
								collection
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
					overflowY: 'hidden',
				}}
			>
				{
					[
						'All', 'Listed',
						{ name: 'Tier', disabled: true }, ...frames,
						{ name: 'Position', disabled: true }, ...Position.Positions
					].map((c, i) => (
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
					<TabPanel key={4 + i} value={tabValue} index={3 + i}>
						{
							renderPlayer(t.id)
						}
					</TabPanel>
				))
			}
			{
				Position.Positions.map((t, i) => (
					<TabPanel key={10 + i} value={tabValue} index={9 + i}>
						{
							renderPlayer(t.id, false, (a, b) => {
								if (sortDirection === 'desc') {
									return parseFloat(b[sortOption]) - parseFloat(a[sortOption])
								} else {
									return parseFloat(a[sortOption]) - parseFloat(b[sortOption])
								}
							}, 'position')
						}
					</TabPanel>
				))
			}
		</Box>
	)
}

export default FootballPlayerCollection
